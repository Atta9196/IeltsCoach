// Firebase services export
export { auth, db, storage, analytics } from './config';
export { firebaseAuth, formatFirebaseUser } from './auth';
export { 
  userService, 
  practiceService, 
  testService, 
  progressService, 
  realtimeService,
  COLLECTIONS 
} from './firestore';
export { 
  storageService, 
  fileValidation, 
  STORAGE_PATHS 
} from './storage';
