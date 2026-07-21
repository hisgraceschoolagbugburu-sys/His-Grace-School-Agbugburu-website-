/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Global Configuration Module (HGS_CONFIG)
 * Central configuration object for school metadata, branding, academic terms,
 * system version, user roles, and Firebase collection keys.
 */

(function (global) {
  'use strict';

  const HGS_CONFIG = {
    // School Metadata & Branding
    school: {
      name: "His Grace School Agbugburu",
      shortName: "HGS Agbugburu",
      motto: "Excellence and Godly Discipline",
      slogan: "Nurturing Future Leaders in Science, Character, and Wisdom",
      established: 2012,
      crestUrl: "/src/assets/images/school_crest_logo_1784645340046.jpg",
      heroBgUrl: "/src/assets/images/school_hero_background_1784645354887.jpg"
    },

    // Brand Colors (Strict Alignment with Style Guide)
    colors: {
      primary: "#123E7C",       // Deep Navy Blue
      primaryHover: "#0D2E5C",
      secondary: "#092144",     // Executive Dark Blue
      accent: "#D4AF37",        // Royal Gold Accent
      accentHover: "#B48811",
      backgroundLight: "#F8FAFC", // Clean light neutral
      surfaceWhite: "#FFFFFF",
      borderLight: "#E2E8F0",
      textDark: "#1E293B",
      textMuted: "#64748B",
      statusSuccess: "#059669",
      statusWarning: "#D97706",
      statusError: "#DC2626",
      statusInfo: "#2563EB"
    },

    // Official Contact Information
    contact: {
      address: "His Grace School Campus, Agbugburu, Ondo State, Nigeria",
      phones: ["09034014865", "08068045866"],
      email: "hisgraceschoolagbugburu@gmail.com",
      websiteUrl: "https://hisgraceschool.edu.ng",
      portalBaseUrl: "https://hisgraceschool.edu.ng/portal"
    },

    // Academic Calendar Session State
    academic: {
      currentSession: "2025/2026",
      currentTerm: "3rd Term",
      upcomingSession: "2026/2027",
      resumptionDate: "2026-09-14",
      admissionOpen: true,
      terms: ["1st Term", "2nd Term", "3rd Term"],
      classes: [
        "JSS 1", "JSS 2", "JSS 3",
        "SSS 1 (Science)", "SSS 1 (Arts)", "SSS 1 (Commercial)",
        "SSS 2 (Science)", "SSS 2 (Arts)", "SSS 2 (Commercial)",
        "SSS 3 (Science)", "SSS 3 (Arts)", "SSS 3 (Commercial)"
      ]
    },

    // System Build Versioning
    system: {
      version: "1.18.0",
      buildPhase: "Phase 18 - Firebase Preparation Architecture",
      environment: "development", // 'development' | 'production'
      maxUploadBytes: 10 * 1024 * 1024, // 10MB
      allowedFileFormats: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
      sessionExpiryMinutes: 120
    },

    // User Roles Matrix
    roles: {
      ADMIN: "administrator",
      TEACHER: "teacher",
      STUDENT: "student",
      APPLICANT: "applicant"
    },

    // Firestore Collection Names (Mapping for future Firebase SDK)
    collections: {
      ADMINISTRATORS: "administrators",
      TEACHERS: "teachers",
      STUDENTS: "students",
      APPLICANTS: "applicants",
      ADMISSIONS: "admissions",
      GALLERY: "gallery",
      NEWS: "news",
      NOTIFICATIONS: "notifications",
      RESULTS: "results",
      ATTENDANCE: "attendance",
      FEES: "fees",
      TIMETABLE: "timetable",
      SETTINGS: "settings"
    },

    // Storage Paths Blueprint
    storagePaths: {
      studentPhotos: "students/portraits",
      teacherPhotos: "teachers/portraits",
      applicantPassports: "applicants/passports",
      birthCertificates: "applicants/documents/birth_certificates",
      galleryAlbums: "gallery/photos",
      resultReports: "results/report_cards",
      schoolLogos: "branding/logos"
    },

    // Firebase Connection Status Placeholder
    firebase: {
      isInitialized: false, // Set to true when Firebase SDK attaches in next phase
      projectID: "his-grace-school-agbugburu",
      authDomain: "his-grace-school-agbugburu.firebaseapp.com",
      storageBucket: "his-grace-school-agbugburu.appspot.com"
    }
  };

  // Attach to global window object
  global.HGS_CONFIG = Object.freeze(HGS_CONFIG);

})(typeof window !== 'undefined' ? window : this);
