/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Reusable Session Management Architecture (HGS_SESSION)
 * Maintains client session state, role validation guards, local storage sync,
 * and future listener hooks for Firebase Authentication onAuthStateChanged.
 */

(function (global) {
  'use strict';

  const SESSION_KEY = "hgs_user_session_v1";
  const CONFIG = global.HGS_CONFIG || {};

  /**
   * HGS_SESSION Object
   */
  const HGS_SESSION = {
    
    /**
     * Retrieves the currently active user session object.
     * @returns {Object|null} User session object or null if unauthenticated.
     */
    getCurrentUser: function () {
      try {
        const rawData = localStorage.getItem(SESSION_KEY);
        if (!rawData) return null;

        const session = JSON.parse(rawData);
        
        // Check session expiration (if timestamp present)
        if (session.expiresAt && new Date().getTime() > session.expiresAt) {
          this.clearSession();
          return null;
        }

        return session.user || null;
      } catch (err) {
        console.error("Error reading HGS user session:", err);
        return null;
      }
    },

    /**
     * Checks if a valid authenticated user session currently exists.
     * @returns {boolean} True if authenticated, false otherwise.
     */
    checkSession: function () {
      return this.getCurrentUser() !== null;
    },

    /**
     * Saves user data into persistent session storage.
     * @param {Object} user - User profile object
     * @param {number} [expiryMinutes] - Optional custom expiry duration in minutes
     */
    saveSession: function (user, expiryMinutes) {
      if (!user) return;

      const duration = expiryMinutes || (CONFIG.system ? CONFIG.system.sessionExpiryMinutes : 120);
      const expiresAt = new Date().getTime() + (duration * 60 * 1000);

      const sessionPayload = {
        user: user,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt
      };

      try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionPayload));
        
        // Also sync role-specific storage flags for legacy compatibility
        if (user.role === 'administrator') {
          localStorage.setItem('hgs_admin_logged_in', 'true');
          localStorage.setItem('hgs_admin_name', user.displayName || 'Administrator');
        } else if (user.role === 'teacher') {
          localStorage.setItem('hgs_teacher_logged_in', 'true');
        } else if (user.role === 'student') {
          localStorage.setItem('hgs_student_logged_in', 'true');
        } else if (user.role === 'applicant') {
          localStorage.setItem('hgs_applicant_logged_in', 'true');
        }

        this._notifySessionChange('LOGIN', user);
      } catch (err) {
        console.error("Error saving HGS session:", err);
      }
    },

    /**
     * Clears session data and removes storage tokens.
     */
    clearSession: function () {
      try {
        const prevUser = this.getCurrentUser();
        localStorage.removeItem(SESSION_KEY);
        
        // Clear legacy session items
        localStorage.removeItem('hgs_admin_logged_in');
        localStorage.removeItem('hgs_teacher_logged_in');
        localStorage.removeItem('hgs_student_logged_in');
        localStorage.removeItem('hgs_applicant_logged_in');

        this._notifySessionChange('LOGOUT', prevUser);
      } catch (err) {
        console.error("Error clearing HGS session:", err);
      }
    },

    /**
     * Route Protection Guard
     * Validates session state and role permissions. If unauthenticated or unauthorized,
     * redirects to the appropriate portal login page.
     *
     * @param {Array<string>|string} allowedRoles - Single role or array of allowed roles
     * @param {string} [fallbackRedirect] - Optional custom redirect URL
     * @returns {Object|boolean} Returns user object if authorized, false if redirected.
     */
    requireAuthentication: function (allowedRoles, fallbackRedirect) {
      const user = this.getCurrentUser();

      // Normalize allowedRoles array
      const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

      if (!user) {
        // Redirect to appropriate login based on requested role
        const targetLogin = fallbackRedirect || this._getLoginRedirectForRole(rolesArray[0]);
        window.location.href = targetLogin;
        return false;
      }

      // Check role authorization (Super Admin always authorized)
      if (user.role !== 'administrator' && rolesArray.length > 0 && !rolesArray.includes(user.role)) {
        console.warn(`User role '${user.role}' not authorized for required roles:`, rolesArray);
        const targetLogin = fallbackRedirect || this._getLoginRedirectForRole(rolesArray[0]);
        window.location.href = targetLogin;
        return false;
      }

      return user;
    },

    /**
     * Refreshes current session expiration timestamp
     */
    refreshSessionToken: function () {
      const user = this.getCurrentUser();
      if (user) {
        this.saveSession(user);
      }
    },

    /**
     * Future Firebase Integration Point:
     * Connects to firebase.auth().onAuthStateChanged((firebaseUser) => { ... })
     * Automatically updates local session state when Firebase Auth state shifts.
     *
     * @param {Function} callback - Subscriber function receiving (user, eventType)
     */
    subscribeSessionChanges: function (callback) {
      if (typeof callback === 'function') {
        window.addEventListener('HGS_SESSION_CHANGED', (event) => {
          callback(event.detail ? event.detail.user : null, event.detail ? event.detail.type : 'CHANGE');
        });
      }
    },

    /**
     * Dispatches custom event across window when session changes
     * @private
     */
    _notifySessionChange: function (eventType, user) {
      if (typeof window !== 'undefined' && typeof CustomEvent === 'function') {
        const event = new CustomEvent('HGS_SESSION_CHANGED', {
          detail: {
            type: eventType,
            user: user,
            timestamp: new Date().toISOString()
          }
        });
        window.dispatchEvent(event);
      }
    },

    /**
     * Helper to determine login page URL for a role
     * @private
     */
    _getLoginRedirectForRole: function (role) {
      switch (role) {
        case 'administrator':
          return 'admin-login.html';
        case 'teacher':
          return 'teacher-login.html';
        case 'student':
          return 'student-login.html';
        case 'applicant':
          return 'applicant-register.html';
        default:
          return 'index.html#/home';
      }
    }
  };

  // Attach to global window object
  global.HGS_SESSION = Object.freeze(HGS_SESSION);

})(typeof window !== 'undefined' ? window : this);
