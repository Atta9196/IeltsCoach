// Firestore database utilities
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc,
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  PRACTICE_SESSIONS: 'practiceSessions',
  TEST_RESULTS: 'testResults',
  PROGRESS: 'progress',
  LESSONS: 'lessons',
  QUESTIONS: 'questions'
};

// User-related functions
export const userService = {
  // Create user document
  createUser: async (uid, userData) => {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, uid);
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user document
  getUser: async (uid) => {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return { success: true, data: userSnap.data() };
      } else {
        return { success: false, error: 'User not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update user document
  updateUser: async (uid, updateData) => {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, uid);
      await updateDoc(userRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete user document
  deleteUser: async (uid) => {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, uid);
      await deleteDoc(userRef);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Practice session functions
export const practiceService = {
  // Create practice session
  createSession: async (userId, sessionData) => {
    try {
      const sessionRef = await addDoc(collection(db, COLLECTIONS.PRACTICE_SESSIONS), {
        userId,
        ...sessionData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true, id: sessionRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user's practice sessions
  getUserSessions: async (userId, limitCount = 10) => {
    try {
      const q = query(
        collection(db, COLLECTIONS.PRACTICE_SESSIONS),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const sessions = [];
      
      querySnapshot.forEach((doc) => {
        sessions.push({ id: doc.id, ...doc.data() });
      });
      
      return { success: true, data: sessions };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update practice session
  updateSession: async (sessionId, updateData) => {
    try {
      const sessionRef = doc(db, COLLECTIONS.PRACTICE_SESSIONS, sessionId);
      await updateDoc(sessionRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Test results functions
export const testService = {
  // Save test result
  saveTestResult: async (userId, testData) => {
    try {
      const testRef = await addDoc(collection(db, COLLECTIONS.TEST_RESULTS), {
        userId,
        ...testData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true, id: testRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user's test results
  getUserTestResults: async (userId, limitCount = 10) => {
    try {
      const q = query(
        collection(db, COLLECTIONS.TEST_RESULTS),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const results = [];
      
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      
      return { success: true, data: results };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Progress tracking functions
export const progressService = {
  // Update user progress
  updateProgress: async (userId, progressData) => {
    try {
      const progressRef = doc(db, COLLECTIONS.PROGRESS, userId);
      await setDoc(progressRef, {
        ...progressData,
        updatedAt: serverTimestamp()
      }, { merge: true });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user progress
  getProgress: async (userId) => {
    try {
      const progressRef = doc(db, COLLECTIONS.PROGRESS, userId);
      const progressSnap = await getDoc(progressRef);
      
      if (progressSnap.exists()) {
        return { success: true, data: progressSnap.data() };
      } else {
        return { success: true, data: null };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Real-time listeners
export const realtimeService = {
  // Listen to user progress changes
  listenToProgress: (userId, callback) => {
    const progressRef = doc(db, COLLECTIONS.PROGRESS, userId);
    return onSnapshot(progressRef, (doc) => {
      if (doc.exists()) {
        callback({ success: true, data: doc.data() });
      } else {
        callback({ success: true, data: null });
      }
    });
  },

  // Listen to practice sessions
  listenToSessions: (userId, callback) => {
    const q = query(
      collection(db, COLLECTIONS.PRACTICE_SESSIONS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const sessions = [];
      querySnapshot.forEach((doc) => {
        sessions.push({ id: doc.id, ...doc.data() });
      });
      callback({ success: true, data: sessions });
    });
  }
};
