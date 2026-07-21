/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Frontend Form Validation Routines (HGS_VALIDATION)
 * Provides centralized validation for email formats, phone numbers, application forms,
 * login credentials, registration inputs, and result uploads.
 */

(function (global) {
  'use strict';

  const HGS_VALIDATION = {

    /**
     * Validates email format standard regex.
     * @param {string} email
     * @returns {boolean}
     */
    validateEmail: function (email) {
      if (!email || typeof email !== 'string') return false;
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return re.test(email.trim());
    },

    /**
     * Validates Nigerian phone number formats (e.g. "09034014865", "08068045866", "+234...").
     * @param {string} phone
     * @returns {boolean}
     */
    validatePhone: function (phone) {
      if (!phone || typeof phone !== 'string') return false;
      const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
      const re = /^(0|\+234)[789][01]\d{8}$/;
      return re.test(cleanPhone);
    },

    /**
     * Validates password strength rules (minimum 6 characters for school portal access).
     * @param {string} password
     * @returns {{ isValid: boolean, error?: string }}
     */
    validatePassword: function (password) {
      if (!password) {
        return { isValid: false, error: "Password cannot be empty." };
      }
      if (password.length < 6) {
        return { isValid: false, error: "Password must be at least 6 characters in length." };
      }
      return { isValid: true };
    },

    /**
     * Validates User Login Form Input
     * @param {string} usernameOrEmail
     * @param {string} password
     * @returns {{ isValid: boolean, errors: Object }}
     */
    validateLoginForm: function (usernameOrEmail, password) {
      const errors = {};

      if (!usernameOrEmail || !usernameOrEmail.trim()) {
        errors.username = "Username or email is required.";
      }

      const passVal = this.validatePassword(password);
      if (!passVal.isValid) {
        errors.password = passVal.error;
      }

      return {
        isValid: Object.keys(errors).length === 0,
        errors: errors
      };
    },

    /**
     * Validates Admission Application Form fields
     * @param {Object} formData
     * @returns {{ isValid: boolean, errors: Object }}
     */
    validateApplicationForm: function (formData) {
      const errors = {};

      if (!formData.surname || !formData.surname.trim()) {
        errors.surname = "Applicant surname is required.";
      }

      if (!formData.firstName || !formData.firstName.trim()) {
        errors.firstName = "Applicant first name is required.";
      }

      if (!formData.dateOfBirth) {
        errors.dateOfBirth = "Date of birth is required.";
      }

      if (!formData.applyingForClass) {
        errors.applyingForClass = "Please select target class.";
      }

      if (!formData.parentFullName || !formData.parentFullName.trim()) {
        errors.parentFullName = "Parent / Guardian full name is required.";
      }

      if (!formData.parentPhone || !this.validatePhone(formData.parentPhone)) {
        errors.parentPhone = "Valid Nigerian phone number is required (e.g. 09034014865).";
      }

      if (formData.parentEmail && !this.validateEmail(formData.parentEmail)) {
        errors.parentEmail = "Please enter a valid email address.";
      }

      return {
        isValid: Object.keys(errors).length === 0,
        errors: errors
      };
    },

    /**
     * Validates Teacher Student Score Entry
     * @param {number|string} caScore - Continous Assessment score (0-30)
     * @param {number|string} examScore - Examination score (0-70)
     * @returns {{ isValid: boolean, errors: Object, totalScore?: number, grade?: string }}
     */
    validateResultForm: function (caScore, examScore) {
      const errors = {};
      const ca = parseFloat(caScore);
      const exam = parseFloat(examScore);

      if (isNaN(ca) || ca < 0 || ca > 30) {
        errors.caScore = "CA score must be a number between 0 and 30.";
      }

      if (isNaN(exam) || exam < 0 || exam > 70) {
        errors.examScore = "Exam score must be a number between 0 and 70.";
      }

      if (Object.keys(errors).length > 0) {
        return { isValid: false, errors: errors };
      }

      const total = ca + exam;
      let grade = "F";

      if (total >= 70) grade = "A";
      else if (total >= 60) grade = "B";
      else if (total >= 50) grade = "C";
      else if (total >= 45) grade = "D";
      else if (total >= 40) grade = "E";

      return {
        isValid: true,
        errors: {},
        totalScore: total,
        grade: grade
      };
    }
  };

  // Attach to global window object
  global.HGS_VALIDATION = Object.freeze(HGS_VALIDATION);

})(typeof window !== 'undefined' ? window : this);
