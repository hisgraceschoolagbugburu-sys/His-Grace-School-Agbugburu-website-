# HIS GRACE SCHOOL AGBUGBURU
## Phase 18 — Firebase Integration & System Architecture Blueprint

This document specifies the exact technical blueprint for connecting Firebase Authentication, Cloud Firestore, and Firebase Storage to His Grace School Agbugburu website architecture.

---

### 1. File Architecture & Dependency Wiring

The JavaScript files created in Phase 18 form a decoupled layer where Firebase SDKs can be loaded in `index.html` (or via ES modules) and wired into the existing handlers without rewriting UI components or DOM scripts.

```
/js/
├── config.js              <-- Global configuration (School Metadata, Roles, Collections)
├── auth.js                <-- Authentication & Role Permission Guards
├── session.js             <-- Client session storage, route protection, auth state listeners
├── database.js            <-- Firestore schemas for 13 collections & abstract CRUD handlers
├── helpers.js             <-- ID generators, date formatters, currency, QR encoder
├── validation.js          <-- Form validation routines
├── ui-notifications.js    <-- Toast alerts, loading overlays & confirmation modals
└── FIREBASE_INTEGRATION_GUIDE.md
```

---

### 2. Firebase Authentication Integration Blueprint

#### Step 1: Initialize Firebase SDK in `index.html` or main script
```javascript
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "his-grace-school-agbugburu.firebaseapp.com",
  projectId: "his-grace-school-agbugburu",
  storageBucket: "his-grace-school-agbugburu.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
```

#### Step 2: Plug into `HGS_AUTH.loginUser()` in `js/auth.js`
Replace the mock promise in `HGS_AUTH.loginUser` with:
```javascript
loginUser: async function(credentials, expectedRole) {
  const { usernameOrEmail, password } = credentials;
  const email = usernameOrEmail.includes('@') 
    ? usernameOrEmail 
    : `${usernameOrEmail}@hisgraceschool.edu.ng`;

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;

  // Fetch Firestore user role profile
  const userProfile = await HGS_DB.dbGetDoc('administrators', firebaseUser.uid)
    || await HGS_DB.dbGetDoc('teachers', firebaseUser.uid)
    || await HGS_DB.dbGetDoc('students', firebaseUser.uid)
    || await HGS_DB.dbGetDoc('applicants', firebaseUser.uid);

  if (expectedRole && userProfile.role !== expectedRole) {
    await signOut(auth);
    throw new Error(`Account role '${userProfile.role}' is not authorized for this portal.`);
  }

  HGS_SESSION.saveSession(userProfile);
  return { success: true, user: userProfile };
}
```

#### Step 3: Auth State Observer in `js/session.js`
Attach `onAuthStateChanged` directly to `HGS_SESSION`:
```javascript
onAuthStateChanged(auth, async (firebaseUser) => {
  if (firebaseUser) {
    // Synchronize local session state
    const userProfile = await HGS_DB.dbGetDoc('users', firebaseUser.uid);
    HGS_SESSION.saveSession(userProfile);
  } else {
    HGS_SESSION.clearSession();
  }
});
```

---

### 3. Firestore Database Collections Blueprint

The 13 collections defined in `js/database.js` map directly to Cloud Firestore:

| Collection Key | Primary Key | Description & Security Access |
|---|---|---|
| `administrators` | `uid` | Super Administrators. Read/Write: Admin only. |
| `teachers` | `uid` | Academic staff profile & assigned subjects. Read: Admin/Self. Write: Admin. |
| `students` | `uid` | Enrolled student records. Read: Admin/Self/Guardian. Write: Admin. |
| `applicants` | `uid` | Admission applicants. Read: Admin/Self. Write: Applicant (Create) / Admin (Review). |
| `admissions` | `admissionId` | Official admission decision letters & scores. Read: Admin/Applicant. Write: Admin. |
| `gallery` | `photoId` | School event photos. Read: Public. Write: Admin. |
| `news` | `newsId` | School announcements & circulars. Read: Public. Write: Admin. |
| `notifications` | `notificationId` | User notifications. Read: Recipient/Role. Write: Admin/System. |
| `results` | `resultId` | Student term exam scorecards. Read: Admin/Teacher/Student. Write: Teacher (Draft) / Admin (Approve). |
| `attendance` | `attendanceId` | Daily class attendance registers. Read: Admin/Teacher/Student. Write: Teacher. |
| `fees` | `feeId` | Student fee balances & digital receipts. Read: Admin/Student. Write: Admin. |
| `timetable` | `timetableId` | Class period schedules. Read: Public/Students/Teachers. Write: Admin. |
| `settings` | `global_config` | Website hero text, logos, banners. Read: Public. Write: Admin. |

---

### 4. Firestore Security Rules Blueprint (`firestore.rules`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isAdmin() {
      return isAuthenticated() && 
        exists(/databases/$(database)/documents/administrators/$(request.auth.uid));
    }

    function isTeacher() {
      return isAuthenticated() && 
        exists(/databases/$(database)/documents/teachers/$(request.auth.uid));
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Collection Access Rules
    match /settings/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /news/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /gallery/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /applicants/{applicantId} {
      allow read: if isOwner(applicantId) || isAdmin();
      allow create: if true;
      allow update: if isOwner(applicantId) || isAdmin();
    }

    match /results/{resultId} {
      allow read: if isAuthenticated();
      allow write: if isTeacher() || isAdmin();
    }
  }
}
```

---

### 5. Firebase Storage Integration Blueprint

Dropzone components on `admin-portal.html`, `admission-application.html`, and `applicant-dashboard.html` connect to Firebase Storage via:

```javascript
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

async function uploadSchoolAsset(file, storagePath, progressCallback) {
  const storage = getStorage();
  const fileRef = ref(storage, `${storagePath}/${Date.now()}_${file.name}`);
  
  const uploadTask = uploadBytesResumable(fileRef, file);
  
  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (progressCallback) progressCallback(progress);
      },
      (error) => reject(error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
}
```

---

*This architecture ensures that plugging in Firebase SDKs requires zero changes to existing page HTML layouts or CSS styling.*
