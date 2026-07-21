/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Global Helper & Formatting Utilities Module (HGS_HELPERS)
 * Provides reusable functions for date parsing, ID generation, currency formatting,
 * HTML escaping, QR payloads, and file size calculations.
 */

(function (global) {
  'use strict';

  const HGS_HELPERS = {
    
    /**
     * Formats a date string or timestamp into clean Nigerian Standard format (e.g., "15 August 2026").
     * @param {string|Date|number} dateInput - Input date representation
     * @param {boolean} [includeTime=false] - Whether to include hours/minutes
     * @returns {string} Formatted date text
     */
    formatDate: function (dateInput, includeTime = false) {
      if (!dateInput) return "N/A";

      const dateObj = new Date(dateInput);
      if (isNaN(dateObj.getTime())) return "Invalid Date";

      const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      };

      if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
      }

      return dateObj.toLocaleDateString('en-GB', options);
    },

    /**
     * Formats an amount into Nigerian Naira currency representation (e.g., "₦45,000.00").
     * @param {number|string} amount - Monetary value
     * @returns {string} Formatted currency text
     */
    formatCurrency: function (amount) {
      const num = parseFloat(amount);
      if (isNaN(num)) return "₦0.00";

      return "₦" + num.toLocaleString('en-NG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },

    /**
     * Generates a unique Applicant Registration ID (Format: HGS-2026-XXXX).
     * @returns {string}
     */
    generateApplicantId: function () {
      const year = new Date().getFullYear();
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      return `HGS-${year}-${randomNum}`;
    },

    /**
     * Generates a unique Student Matriculation Number (Format: STD/2026/XXX).
     * @returns {string}
     */
    generateStudentId: function () {
      const year = new Date().getFullYear();
      const randomNum = Math.floor(100 + Math.random() * 900);
      return `STD/${year}/${randomNum}`;
    },

    /**
     * Generates a unique Teacher Staff ID (Format: TCH/2026/XXX).
     * @returns {string}
     */
    generateStaffId: function () {
      const year = new Date().getFullYear();
      const randomNum = Math.floor(10 + Math.random() * 90);
      return `TCH/${year}/0${randomNum}`;
    },

    /**
     * Generates a secure QR payload string for verification.
     * @param {Object} entityData - Student or Applicant data object
     * @returns {string} JSON Encoded Base64 or plain string
     */
    generateQRPayload: function (entityData) {
      if (!entityData) return "";

      const payload = {
        school: "His Grace School Agbugburu",
        id: entityData.studentId || entityData.applicantId || entityData.uid,
        name: entityData.fullName || `${entityData.surname || ''} ${entityData.firstName || ''}`.trim(),
        class: entityData.currentClass || entityData.applyingForClass || "N/A",
        status: entityData.status || "Verified",
        timestamp: new Date().toISOString()
      };

      try {
        return btoa(JSON.stringify(payload));
      } catch (err) {
        return JSON.stringify(payload);
      }
    },

    /**
     * Decodes and verifies a QR payload string.
     * @param {string} qrString - Scanned QR code text
     * @returns {Object|null}
     */
    verifyQRPayload: function (qrString) {
      if (!qrString) return null;

      try {
        let decodedStr = qrString;
        // Try base64 decode if applicable
        if (!qrString.startsWith('{')) {
          decodedStr = atob(qrString);
        }

        const data = JSON.parse(decodedStr);
        if (data.school && data.school.includes("His Grace School")) {
          return {
            isValid: true,
            data: data
          };
        }
        return { isValid: false, error: "QR code belongs to an external organization." };
      } catch (err) {
        return { isValid: false, error: "Corrupted or invalid QR payload format." };
      }
    },

    /**
     * Escapes unsafe HTML characters to prevent XSS vulnerabilities.
     * @param {string} str - Raw string input
     * @returns {string} Sanitized string
     */
    escapeHTML: function (str) {
      if (!str) return "";
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    },

    /**
     * Formats file bytes into human-readable size (e.g., "2.4 MB").
     * @param {number} bytes - File size in bytes
     * @returns {string}
     */
    formatFileSize: function (bytes) {
      if (!bytes || bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    },

    /**
     * Debounces function calls to optimize event listeners
     * @param {Function} func - Target function
     * @param {number} waitMs - Delay in milliseconds
     * @returns {Function}
     */
    debounce: function (func, waitMs) {
      let timeout;
      return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), waitMs);
      };
    }
  };

  // Attach to global window object
  global.HGS_HELPERS = Object.freeze(HGS_HELPERS);

})(typeof window !== 'undefined' ? window : this);
