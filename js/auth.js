/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Authentication & Access Control Module (HGS_AUTH)
 * Directly integrates with Firebase Authentication & Cloud Firestore.
 */

import { auth, db } from './firebase.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

(function (global) {
  'use strict';

  const ROLES = Object.freeze({
    ADMINISTRATOR: "administrator",
    TEACHER: "teacher",
    STUDENT: "student",
    APPLICANT: "applicant"
  });

  const PERMISSIONS = Object.freeze({
    [ROLES.ADMINISTRATOR]: [
      "manage_system_settings",
      "manage_homepage_content",
      "review_admissions",
      "manage_students",
      "manage_teachers",
      "upload_gallery",
      "publish_news",
      "approve_results",
      "manage_fees",
      "issue_qr_codes",
      "view_all_portals"
    ],
    [ROLES.TEACHER]: [
      "view_assigned_classes",
      "enter_student_scores",
      "take_class_attendance",
      "view_class_timetable",
      "update_teacher_profile"
    ],
    [ROLES.STUDENT]: [
      "view_term_results",
      "download_report_card",
      "view_class_timetable",
      "check_fee_status",
      "view_student_id_card",
      "verify_qr_identity"
    ],
    [ROLES.APPLICANT]: [
      "fill_admission_form",
      "upload_application_documents",
      "track_admission_status",
      "download_admission_letter",
      "pay_application_fee"
    ]
  });

  const HGS_AUTH = {
    ROLES: ROLES,
    PERMISSIONS: PERMISSIONS,

    /**
     * Authenticates user via Firebase Authentication & fetches Firestore role profile.
     * @param {Object} credentials - { usernameOrEmail, password }
     * @param {string} [expectedRole] - Role identifier ('administrator' | 'teacher' | 'student' | 'applicant')
     * @returns {Promise<Object>} Promise resolving to authenticated user object
     */
    loginUser: async function (credentials, expectedRole) {
      const { usernameOrEmail, password } = credentials || {};

      if (!usernameOrEmail || !password) {
        throw new Error("Email and password are required.");
      }

      // Format email
      const email = usernameOrEmail.includes('@')
        ? usernameOrEmail.trim()
        : `${usernameOrEmail.trim()}@hisgraceschool.edu.ng`;

      // 1. Firebase Auth Sign-In
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const uid = firebaseUser.uid;

      // 2. Fetch User Profile from Firestore across collections
      let userProfile = null;

      // Check applicant
      const appSnap = await getDoc(doc(db, 'applicants', uid));
      if (appSnap.exists()) {
        userProfile = { uid: uid, email: firebaseUser.email, ...appSnap.data(), role: ROLES.APPLICANT };
      } else {
        // Check administrator
        const adminSnap = await getDoc(doc(db, 'administrators', uid));
        if (adminSnap.exists()) {
          userProfile = { uid: uid, email: firebaseUser.email, ...adminSnap.data(), role: ROLES.ADMINISTRATOR };
        } else {
          // Check teacher
          const tchSnap = await getDoc(doc(db, 'teachers', uid));
          if (tchSnap.exists()) {
            userProfile = { uid: uid, email: firebaseUser.email, ...tchSnap.data(), role: ROLES.TEACHER };
          } else {
            // Check student
            const stdSnap = await getDoc(doc(db, 'students', uid));
            if (stdSnap.exists()) {
              userProfile = { uid: uid, email: firebaseUser.email, ...stdSnap.data(), role: ROLES.STUDENT };
            } else {
              // Fallback
              userProfile = {
                uid: uid,
                email: firebaseUser.email,
                role: expectedRole || ROLES.APPLICANT,
                displayName: firebaseUser.displayName || email.split('@')[0]
              };
            }
          }
        }
      }

      // Check Role match if expected
      if (expectedRole && userProfile.role !== expectedRole && userProfile.role !== ROLES.ADMINISTRATOR) {
        await signOut(auth);
        throw new Error(`Account role '${userProfile.role}' is not authorized for the ${expectedRole} portal.`);
      }

      // 3. Save Session
      if (global.HGS_SESSION && typeof global.HGS_SESSION.saveSession === 'function') {
        global.HGS_SESSION.saveSession(userProfile);
      }

      return {
        success: true,
        user: userProfile
      };
    },

    /**
     * Registers a new Applicant account in Firebase Auth and creates Firestore applicant record.
     * @param {Object} data - Applicant details from registration form
     * @returns {Promise<Object>}
     */
    registerApplicant: async function (data) {
      const { email, password, surname, firstname, othername, gender, dob, desiredClass, guardian, guardianPhone, address, phone } = data;

      // 1. Create Firebase Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const uid = firebaseUser.uid;

      const generatedApplicantId = `HGS-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      // 2. Prepare Applicant Profile
      const applicantProfile = {
        uid: uid,
        applicantId: generatedApplicantId,
        surname: surname,
        firstName: firstname,
        otherNames: othername || '',
        displayName: `${firstname} ${surname}`,
        gender: gender,
        dateOfBirth: dob,
        applyingForClass: desiredClass,
        academicSession: '2026/2027',
        parentFullName: guardian,
        parentPhone: guardianPhone,
        parentEmail: email,
        residentialAddress: address,
        email: email,
        phone: phone,
        status: 'Draft',
        role: ROLES.APPLICANT,
        createdAt: new Date().toISOString()
      };

      // 3. Write to Cloud Firestore 'applicants' collection
      await setDoc(doc(db, 'applicants', uid), applicantProfile);

      // 4. Save Session
      if (global.HGS_SESSION && typeof global.HGS_SESSION.saveSession === 'function') {
        global.HGS_SESSION.saveSession(applicantProfile);
      }

      return {
        success: true,
        user: applicantProfile
      };
    },

    /**
     * Signs out user from Firebase Auth and clears session.
     * @returns {Promise<boolean>}
     */
    logoutUser: async function () {
      await signOut(auth);
      if (global.HGS_SESSION && typeof global.HGS_SESSION.clearSession === 'function') {
        global.HGS_SESSION.clearSession();
      }
      return true;
    },

    /**
     * Sends Password Reset Email via Firebase Auth.
     * @param {string} email
     * @returns {Promise<Object>}
     */
    resetPassword: async function (email) {
      if (!email || !email.includes('@')) {
        throw new Error("Please enter a valid email address.");
      }
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message: `Password reset link has been sent to ${email}. Please check your inbox.`
      };
    }
  };

  // Attach to global window object
  global.HGS_AUTH = Object.freeze(HGS_AUTH);

})(typeof window !== 'undefined' ? window : this);

export const HGS_AUTH = window.HGS_AUTH;
