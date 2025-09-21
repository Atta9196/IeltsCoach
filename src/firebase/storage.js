// Firebase Storage utilities
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll,
  getMetadata
} from 'firebase/storage';
import { storage } from './config';

// Storage paths
export const STORAGE_PATHS = {
  USER_AVATARS: 'avatars',
  AUDIO_FILES: 'audio',
  DOCUMENTS: 'documents',
  PRACTICE_MATERIALS: 'practice-materials'
};

// File upload functions
export const storageService = {
  // Upload file
  uploadFile: async (file, path, metadata = {}) => {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return { 
        success: true, 
        downloadURL,
        metadata: {
          name: snapshot.metadata.name,
          size: snapshot.metadata.size,
          contentType: snapshot.metadata.contentType,
          timeCreated: snapshot.metadata.timeCreated
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Upload user avatar
  uploadAvatar: async (file, userId) => {
    const timestamp = Date.now();
    const fileName = `avatar_${userId}_${timestamp}`;
    const path = `${STORAGE_PATHS.USER_AVATARS}/${fileName}`;
    
    return await storageService.uploadFile(file, path, {
      contentType: file.type,
      customMetadata: {
        userId: userId,
        type: 'avatar'
      }
    });
  },

  // Upload audio file
  uploadAudio: async (file, userId, sessionId) => {
    const timestamp = Date.now();
    const fileName = `audio_${userId}_${sessionId}_${timestamp}`;
    const path = `${STORAGE_PATHS.AUDIO_FILES}/${fileName}`;
    
    return await storageService.uploadFile(file, path, {
      contentType: file.type,
      customMetadata: {
        userId: userId,
        sessionId: sessionId,
        type: 'audio'
      }
    });
  },

  // Upload document
  uploadDocument: async (file, userId, documentType) => {
    const timestamp = Date.now();
    const fileName = `${documentType}_${userId}_${timestamp}`;
    const path = `${STORAGE_PATHS.DOCUMENTS}/${fileName}`;
    
    return await storageService.uploadFile(file, path, {
      contentType: file.type,
      customMetadata: {
        userId: userId,
        documentType: documentType,
        type: 'document'
      }
    });
  },

  // Get download URL
  getDownloadURL: async (path) => {
    try {
      const storageRef = ref(storage, path);
      const downloadURL = await getDownloadURL(storageRef);
      return { success: true, downloadURL };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete file
  deleteFile: async (path) => {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // List files in directory
  listFiles: async (path, maxResults = 100) => {
    try {
      const storageRef = ref(storage, path);
      const result = await listAll(storageRef);
      
      const files = [];
      for (const itemRef of result.items) {
        const metadata = await getMetadata(itemRef);
        const downloadURL = await getDownloadURL(itemRef);
        
        files.push({
          name: metadata.name,
          size: metadata.size,
          contentType: metadata.contentType,
          timeCreated: metadata.timeCreated,
          downloadURL,
          path: itemRef.fullPath
        });
      }
      
      return { success: true, files };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get file metadata
  getFileMetadata: async (path) => {
    try {
      const storageRef = ref(storage, path);
      const metadata = await getMetadata(storageRef);
      return { success: true, metadata };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// File validation helpers
export const fileValidation = {
  // Validate image file
  validateImage: (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid file type. Please upload a valid image file.' };
    }
    
    if (file.size > maxSize) {
      return { valid: false, error: 'File size too large. Please upload an image smaller than 5MB.' };
    }
    
    return { valid: true };
  },

  // Validate audio file
  validateAudio: (file) => {
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'];
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid file type. Please upload a valid audio file.' };
    }
    
    if (file.size > maxSize) {
      return { valid: false, error: 'File size too large. Please upload an audio file smaller than 50MB.' };
    }
    
    return { valid: true };
  },

  // Validate document file
  validateDocument: (file) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid file type. Please upload a valid document file.' };
    }
    
    if (file.size > maxSize) {
      return { valid: false, error: 'File size too large. Please upload a document smaller than 10MB.' };
    }
    
    return { valid: true };
  }
};
