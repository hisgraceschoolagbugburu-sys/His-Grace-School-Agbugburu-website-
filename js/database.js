/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Database Architecture & Firestore Schema Definitions Module (HGS_DB)
 * Defines document schemas for all 13 school database collections, provides abstract CRUD helpers,
 * and maintains an in-memory repository cache ready for live Firestore SDK integration.
 */

(function (global) {
  'use strict';

  const CONFIG = global.HGS_CONFIG || {
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
    }
  };

  /**
   * 13 FIRESTORE COLLECTION SCHEMAS
   * These JSON schema definitions represent the exact structure to be written to Firestore documents.
   */
  const COLLECTION_SCHEMAS = Object.freeze({

    // 1. Administrators Collection
    [CONFIG.collections.ADMINISTRATORS]: {
      fields: {
        uid: "string (Primary Key / Firebase Auth UID)",
        username: "string",
        email: "string",
        fullName: "string",
        title: "string (e.g., 'Dr.', 'Rev.')",
        role: "string ('administrator')",
        designation: "string (e.g., 'Super Administrator & IT Director')",
        phoneNumber: "string",
        photoUrl: "string (Firebase Storage URL)",
        isActive: "boolean",
        createdAt: "timestamp",
        lastLoginAt: "timestamp"
      }
    },

    // 2. Teachers Collection
    [CONFIG.collections.TEACHERS]: {
      fields: {
        uid: "string (Primary Key / Auth UID)",
        staffId: "string (e.g., 'TCH/2026/012')",
        title: "string",
        fullName: "string",
        email: "string",
        phoneNumber: "string",
        subjectsAssigned: "array of strings",
        classesAssigned: "array of strings",
        qualification: "string (e.g., 'B.Sc. Ed Physics')",
        photoUrl: "string",
        employmentDate: "string (YYYY-MM-DD)",
        isActive: "boolean",
        createdAt: "timestamp"
      }
    },

    // 3. Students Collection
    [CONFIG.collections.STUDENTS]: {
      fields: {
        uid: "string (Primary Key / Auth UID)",
        studentId: "string (e.g., 'STD/2026/104')",
        fullName: "string",
        gender: "string ('Male' | 'Female')",
        dateOfBirth: "string (YYYY-MM-DD)",
        currentClass: "string (e.g., 'JSS 1')",
        arm: "string (e.g., 'A', 'B')",
        guardianName: "string",
        guardianPhone: "string",
        guardianEmail: "string",
        address: "string",
        photoUrl: "string",
        admissionYear: "string",
        status: "string ('Active' | 'Graduated' | 'Suspended')",
        createdAt: "timestamp"
      }
    },

    // 4. Applicants Collection
    [CONFIG.collections.APPLICANTS]: {
      fields: {
        uid: "string (Primary Key / Auth UID)",
        applicantId: "string (e.g., 'HGS-2026-0842')",
        surname: "string",
        firstName: "string",
        otherNames: "string",
        dateOfBirth: "string",
        gender: "string",
        applyingForClass: "string",
        academicSession: "string ('2026/2027')",
        parentFullName: "string",
        parentPhone: "string",
        parentEmail: "string",
        residentialAddress: "string",
        passportPhotoUrl: "string",
        birthCertUrl: "string",
        status: "string ('Pending' | 'Approved' | 'Rejected' | 'Interview Scheduled')",
        submissionDate: "timestamp",
        reviewedBy: "string (Admin UID)"
      }
    },

    // 5. Admissions Collection
    [CONFIG.collections.ADMISSIONS]: {
      fields: {
        admissionId: "string (Primary Key)",
        applicantId: "string (Ref -> Applicants)",
        studentIdAssigned: "string",
        classAssigned: "string",
        interviewDate: "string (YYYY-MM-DD)",
        interviewTime: "string",
        interviewScore: "number",
        decision: "string ('Admitted' | 'Declined' | 'Waitlisted')",
        letterUrl: "string (PDF Firebase Storage URL)",
        decisionNotes: "string",
        decisionDate: "timestamp"
      }
    },

    // 6. Gallery Collection
    [CONFIG.collections.GALLERY]: {
      fields: {
        photoId: "string (Primary Key)",
        title: "string",
        category: "string ('Academics' | 'Sports' | 'Facilities' | 'Cultural')",
        imageUrl: "string",
        thumbnailUrl: "string",
        caption: "string",
        uploadedBy: "string (Admin UID)",
        uploadedAt: "timestamp"
      }
    },

    // 7. News Collection
    [CONFIG.collections.NEWS]: {
      fields: {
        newsId: "string (Primary Key)",
        title: "string",
        slug: "string",
        category: "string ('Circular' | 'Event' | 'Announcement')",
        excerpt: "string",
        content: "string (HTML or Markdown)",
        bannerImageUrl: "string",
        isPublished: "boolean",
        publishedAt: "timestamp",
        author: "string"
      }
    },

    // 8. Notifications Collection
    [CONFIG.collections.NOTIFICATIONS]: {
      fields: {
        notificationId: "string (Primary Key)",
        targetRole: "string ('all' | 'administrator' | 'teacher' | 'student' | 'applicant')",
        recipientUid: "string (Optional specific user UID)",
        title: "string",
        message: "string",
        type: "string ('info' | 'warning' | 'success' | 'alert')",
        isRead: "boolean",
        createdAt: "timestamp"
      }
    },

    // 9. Results Collection
    [CONFIG.collections.RESULTS]: {
      fields: {
        resultId: "string (Primary Key)",
        studentId: "string (Ref -> Students)",
        studentName: "string",
        className: "string",
        session: "string ('2025/2026')",
        term: "string ('3rd Term')",
        subject: "string",
        caScore: "number (0-30)",
        examScore: "number (0-70)",
        totalScore: "number (0-100)",
        grade: "string ('A' | 'B' | 'C' | 'D' | 'E' | 'F')",
        teacherComment: "string",
        principalComment: "string",
        isApproved: "boolean",
        uploadedBy: "string (Teacher UID)"
      }
    },

    // 10. Attendance Collection
    [CONFIG.collections.ATTENDANCE]: {
      fields: {
        attendanceId: "string (Primary Key)",
        className: "string",
        date: "string (YYYY-MM-DD)",
        takenBy: "string (Teacher UID)",
        records: "array of objects [{ studentId, status: 'Present' | 'Absent' | 'Late', remark }]",
        createdAt: "timestamp"
      }
    },

    // 11. Fees Collection
    [CONFIG.collections.FEES]: {
      fields: {
        feeId: "string (Primary Key)",
        studentId: "string (Ref -> Students)",
        session: "string",
        term: "string",
        amountDue: "number",
        amountPaid: "number",
        balance: "number",
        status: "string ('Paid' | 'Partial' | 'Unpaid')",
        receiptNumber: "string",
        paymentDate: "timestamp"
      }
    },

    // 12. Timetable Collection
    [CONFIG.collections.TIMETABLE]: {
      fields: {
        timetableId: "string (Primary Key)",
        className: "string",
        academicSession: "string",
        term: "string",
        dayOfWeek: "string ('Monday' - 'Friday')",
        periods: "array of objects [{ periodNumber, startTime, endTime, subject, teacherName }]",
        lastUpdated: "timestamp"
      }
    },

    // 13. Settings Collection
    [CONFIG.collections.SETTINGS]: {
      fields: {
        settingId: "string ('global_config')",
        schoolName: "string",
        topBannerText: "string",
        welcomeHeadline: "string",
        welcomeBody: "string",
        featureCards: "array of objects",
        admissionOpen: "boolean",
        maintenanceMode: "boolean",
        lastUpdatedBy: "string",
        updatedAt: "timestamp"
      }
    }
  });

  /**
   * In-Memory Local Cache Store for Frontend Pre-Firebase Operations
   */
  const LOCAL_CACHE = {
    [CONFIG.collections.SETTINGS]: [
      {
        id: "global_config",
        schoolName: "His Grace School Agbugburu",
        topBannerText: "🎓 Admissions Open for 2026/2027 Academic Session! Apply Online Now.",
        welcomeHeadline: "Welcome to His Grace School Agbugburu",
        welcomeBody: "Nurturing future leaders through academic excellence, sound moral discipline, innovative science learning, and holistic child development.",
        admissionOpen: true,
        updatedAt: new Date().toISOString()
      }
    ],
    [CONFIG.collections.NEWS]: [
      {
        id: "news_01",
        title: "2026/2027 Entrance Examination Date Announced",
        slug: "entrance-exam-2026",
        category: "Announcement",
        excerpt: "Entrance examinations for JSS1 and SSS1 transfer students scheduled for August 15, 2026.",
        isPublished: true,
        publishedAt: new Date().toISOString()
      }
    ]
  };

  /**
   * HGS_DB Module Interface
   */
  const HGS_DB = {
    COLLECTION_SCHEMAS: COLLECTION_SCHEMAS,

    /**
     * Retrieves a single document by ID from a Firestore collection.
     * 
     * FUTURE FIREBASE INTEGRATION CODE:
     * return firebase.firestore().collection(collectionName).doc(docId).get()
     *   .then(doc => doc.exists ? { id: doc.id, ...doc.data() } : null);
     *
     * @param {string} collectionName - Name of the collection
     * @param {string} docId - Primary Key Document ID
     * @returns {Promise<Object|null>}
     */
    dbGetDoc: function (collectionName, docId) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const list = LOCAL_CACHE[collectionName] || [];
          const found = list.find(item => item.id === docId || item.uid === docId);
          resolve(found || null);
        }, 150);
      });
    },

    /**
     * Queries documents from a collection with optional filters.
     *
     * FUTURE FIREBASE INTEGRATION CODE:
     * let query = firebase.firestore().collection(collectionName);
     * if (filters.where) query = query.where(filters.where.field, filters.where.op, filters.where.val);
     * return query.get().then(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
     *
     * @param {string} collectionName
     * @param {Object} [filters] - Query parameters
     * @returns {Promise<Array<Object>>}
     */
    dbQueryDocs: function (collectionName, filters) {
      return new Promise((resolve) => {
        setTimeout(() => {
          let results = LOCAL_CACHE[collectionName] ? [...LOCAL_CACHE[collectionName]] : [];

          if (filters && filters.where) {
            const { field, val } = filters.where;
            results = results.filter(item => item[field] === val);
          }

          resolve(results);
        }, 200);
      });
    },

    /**
     * Writes or overwrites a document in a Firestore collection.
     *
     * FUTURE FIREBASE INTEGRATION CODE:
     * return firebase.firestore().collection(collectionName).doc(docId).set(data, { merge: true });
     *
     * @param {string} collectionName
     * @param {string} docId
     * @param {Object} data
     * @returns {Promise<Object>}
     */
    dbSetDoc: function (collectionName, docId, data) {
      return new Promise((resolve) => {
        if (!LOCAL_CACHE[collectionName]) {
          LOCAL_CACHE[collectionName] = [];
        }

        const docPayload = {
          id: docId,
          ...data,
          updatedAt: new Date().toISOString()
        };

        const index = LOCAL_CACHE[collectionName].findIndex(item => item.id === docId);
        if (index >= 0) {
          LOCAL_CACHE[collectionName][index] = docPayload;
        } else {
          LOCAL_CACHE[collectionName].push(docPayload);
        }

        resolve({ success: true, doc: docPayload });
      });
    },

    /**
     * Updates specific fields of an existing document in a collection.
     *
     * FUTURE FIREBASE INTEGRATION CODE:
     * return firebase.firestore().collection(collectionName).doc(docId).update(updates);
     *
     * @param {string} collectionName
     * @param {string} docId
     * @param {Object} updates
     * @returns {Promise<boolean>}
     */
    dbUpdateDoc: function (collectionName, docId, updates) {
      return new Promise((resolve, reject) => {
        const list = LOCAL_CACHE[collectionName] || [];
        const index = list.findIndex(item => item.id === docId);

        if (index === -1) {
          return reject(new Error(`Document '${docId}' not found in '${collectionName}'.`));
        }

        LOCAL_CACHE[collectionName][index] = {
          ...LOCAL_CACHE[collectionName][index],
          ...updates,
          updatedAt: new Date().toISOString()
        };

        resolve(true);
      });
    },

    /**
     * Deletes a document from a collection.
     *
     * FUTURE FIREBASE INTEGRATION CODE:
     * return firebase.firestore().collection(collectionName).doc(docId).delete();
     *
     * @param {string} collectionName
     * @param {string} docId
     * @returns {Promise<boolean>}
     */
    dbDeleteDoc: function (collectionName, docId) {
      return new Promise((resolve) => {
        if (LOCAL_CACHE[collectionName]) {
          LOCAL_CACHE[collectionName] = LOCAL_CACHE[collectionName].filter(item => item.id !== docId);
        }
        resolve(true);
      });
    },

    /**
     * Real-time Document Listener stub
     *
     * FUTURE FIREBASE INTEGRATION CODE:
     * return firebase.firestore().collection(collectionName).doc(docId)
     *   .onSnapshot(snapshot => callback(snapshot.data()));
     *
     * @param {string} collectionName
     * @param {string} docId
     * @param {Function} callback
     * @returns {Function} Unsubscribe function
     */
    dbListenDoc: function (collectionName, docId, callback) {
      this.dbGetDoc(collectionName, docId).then(data => callback(data));
      // Return dummy unsubscribe handler
      return function () {
        console.log(`Unsubscribed listener for ${collectionName}/${docId}`);
      };
    }
  };

  // Attach to global window object
  global.HGS_DB = Object.freeze(HGS_DB);

})(typeof window !== 'undefined' ? window : this);
