/**
 * HIS GRACE SCHOOL AGBUGBURU
 * Database Architecture & Firestore Operations Module (HGS_DB)
 * Directly connects to Cloud Firestore for persistent cloud data management.
 */

import { db, handleFirestoreError } from './firebase.js';
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';

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
   * HGS_DB Module Interface
   */
  const HGS_DB = {

    /**
     * Retrieves a single document by ID from a Firestore collection.
     * @param {string} collectionName - Name of the collection
     * @param {string} docId - Primary Key Document ID
     * @returns {Promise<Object|null>}
     */
    dbGetDoc: async function (collectionName, docId) {
      const path = `${collectionName}/${docId}`;
      try {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
      } catch (error) {
        handleFirestoreError(error, 'get', path);
        return null;
      }
    },

    /**
     * Queries documents from a collection with optional filters.
     * @param {string} collectionName
     * @param {Object} [filters] - Query parameters e.g. { where: { field: 'status', op: '==', val: 'Draft' } }
     * @returns {Promise<Array<Object>>}
     */
    dbQueryDocs: async function (collectionName, filters) {
      try {
        let colRef = collection(db, collectionName);
        let q = colRef;

        if (filters && filters.where) {
          const { field, op = '==', val } = filters.where;
          q = query(colRef, where(field, op, val));
        }

        const querySnap = await getDocs(q);
        const results = [];
        querySnap.forEach((d) => {
          results.push({ id: d.id, ...d.data() });
        });
        return results;
      } catch (error) {
        handleFirestoreError(error, 'list', collectionName);
        return [];
      }
    },

    /**
     * Writes or overwrites a document in a Firestore collection.
     * @param {string} collectionName
     * @param {string} docId
     * @param {Object} data
     * @returns {Promise<Object>}
     */
    dbSetDoc: async function (collectionName, docId, data) {
      const path = `${collectionName}/${docId}`;
      try {
        const docPayload = {
          ...data,
          updatedAt: new Date().toISOString()
        };
        const docRef = doc(db, collectionName, docId);
        await setDoc(docRef, docPayload, { merge: true });
        return { success: true, doc: docPayload };
      } catch (error) {
        handleFirestoreError(error, 'write', path);
        throw error;
      }
    },

    /**
     * Updates specific fields of an existing document in a collection.
     * @param {string} collectionName
     * @param {string} docId
     * @param {Object} updates
     * @returns {Promise<boolean>}
     */
    dbUpdateDoc: async function (collectionName, docId, updates) {
      const path = `${collectionName}/${docId}`;
      try {
        const docRef = doc(db, collectionName, docId);
        await updateDoc(docRef, {
          ...updates,
          updatedAt: new Date().toISOString()
        });
        return true;
      } catch (error) {
        handleFirestoreError(error, 'update', path);
        throw error;
      }
    },

    /**
     * Deletes a document from a collection.
     * @param {string} collectionName
     * @param {string} docId
     * @returns {Promise<boolean>}
     */
    dbDeleteDoc: async function (collectionName, docId) {
      const path = `${collectionName}/${docId}`;
      try {
        const docRef = doc(db, collectionName, docId);
        await deleteDoc(docRef);
        return true;
      } catch (error) {
        handleFirestoreError(error, 'delete', path);
        throw error;
      }
    },

    /**
     * Real-time Document Listener
     * @param {string} collectionName
     * @param {string} docId
     * @param {Function} callback
     * @returns {Function} Unsubscribe function
     */
    dbListenDoc: function (collectionName, docId, callback) {
      const path = `${collectionName}/${docId}`;
      const docRef = doc(db, collectionName, docId);
      const unsubscribe = onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            callback({ id: snapshot.id, ...snapshot.data() });
          } else {
            callback(null);
          }
        },
        (error) => {
          handleFirestoreError(error, 'get', path);
        }
      );
      return unsubscribe;
    }
  };

  // Attach to global window object
  global.HGS_DB = Object.freeze(HGS_DB);

})(typeof window !== 'undefined' ? window : this);

export const HGS_DB = window.HGS_DB;
