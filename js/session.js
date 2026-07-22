/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Reusable Session Management Architecture (HGS_SESSION)
 * Maintains client session state, role validation guards, local storage sync,
 * and Firebase Authentication state listeners.
 */

import { auth, db } from './firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

(function (global) {
  'use strict';

  const SESSION_KEY = "hgs_user_session_v1";

  /**
   * HGS_SESSION Object
   */
  const HGS_SESSION = {
    
    /**
     * Retrieves the currently active user session object from localStorage.
     * @returns {Object|null} User session object or null if unauthenticated.
     */
    getCurrentUser: function () {
      try {
        const rawData = localStorage.getItem(SESSION_KEY);
        if (!rawData) return null;

        const session = JSON.parse(rawData);
        
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

      const duration = expiryMinutes || 120; // Default 2 hours
      const expiresAt = new Date().getTime() + (duration * 60 * 1000);

      const sessionPayload = {
        user: user,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt
      };

      try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionPayload));
        
        // Role flags for legacy compatibility
        if (user.role === 'administrator') {
          localStorage.setItem('hgs_admin_logged_in', 'true');
          localStorage.setItem('hgs_admin_name', user.displayName || user.fullName || 'Administrator');
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
      const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

      if (!user) {
        const targetLogin = fallbackRedirect || this._getLoginRedirectForRole(rolesArray[0]);
        window.location.href = targetLogin;
        return false;
      }

      if (user.role !== 'administrator' && rolesArray.length > 0 && !rolesArray.includes(user.role)) {
        console.warn(`User role '${user.role}' not authorized for required roles:`, rolesArray);
        const targetLogin = fallbackRedirect || this._getLoginRedirectForRole(rolesArray[0]);
        window.location.href = targetLogin;
        return false;
      }

      return user;
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
          return 'applicant-login.html';
        default:
          return 'index.html#/home';
      }
    }
  };

  // Attach to global window object
  global.HGS_SESSION = Object.freeze(HGS_SESSION);

  // Synchronize with Firebase Auth Listener
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      // Check Firestore collections for role profile
      try {
        let profile = null;
        const uid = firebaseUser.uid;

        // Try administrator first
        const adminSnap = await getDoc(doc(db, 'administrators', uid));
        if (adminSnap.exists() || firebaseUser.email === 'hisgraceschoolagbugburu@gmail.com') {
          profile = {
            uid: uid,
            email: firebaseUser.email,
            ...(adminSnap.exists() ? adminSnap.data() : {}),
            role: 'administrator',
            fullName: adminSnap.exists() && adminSnap.data().fullName ? adminSnap.data().fullName : 'Dr. Gabriel Okonjo'
          };
        } else {
          // Try applicants
          const appSnap = await getDoc(doc(db, 'applicants', uid));
          if (appSnap.exists()) {
            profile = { uid: uid, email: firebaseUser.email, ...appSnap.data(), role: 'applicant' };
          } else {
            // Try teachers
            const tchSnap = await getDoc(doc(db, 'teachers', uid));
            if (tchSnap.exists()) {
              profile = { uid: uid, email: firebaseUser.email, ...tchSnap.data(), role: 'teacher' };
            } else {
              // Try students
              const stdSnap = await getDoc(doc(db, 'students', uid));
              if (stdSnap.exists()) {
                profile = { uid: uid, email: firebaseUser.email, ...stdSnap.data(), role: 'student' };
              } else {
                profile = {
                  uid: uid,
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                  role: 'applicant'
                };
              }
            }
          }
        }
        HGS_SESSION.saveSession(profile);
      } catch (err) {
        console.error("Error fetching user profile on auth change:", err);
      }
    } else {
      // If no Firebase Auth user is present, only clear session if active session is already expired or absent
      const currentUser = HGS_SESSION.getCurrentUser();
      if (!currentUser) {
        HGS_SESSION.clearSession();
      }
    }
  });

})(typeof window !== 'undefined' ? window : this);

export const HGS_SESSION = window.HGS_SESSION;
