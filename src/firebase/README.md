# Firebase Setup Guide for IELTS Coach

## 🔥 Firebase Installation Complete!

Firebase has been successfully installed and configured for your IELTS Coach application. Here's what has been set up:

## 📁 Firebase Structure Created

```
src/firebase/
├── config.js          # Firebase configuration and initialization
├── auth.js            # Authentication utilities and functions
├── firestore.js       # Firestore database operations
├── storage.js         # Firebase Storage for file uploads
├── index.js           # Main exports
└── README.md          # This setup guide
```

## 🚀 Services Configured

### ✅ **Authentication (Firebase Auth)**
- Email/Password authentication
- Google OAuth integration
- Password reset functionality
- User profile management
- Real-time auth state monitoring

### ✅ **Database (Firestore)**
- User profiles and data storage
- Practice session tracking
- Test results storage
- Progress monitoring
- Real-time data synchronization

### ✅ **Storage (Firebase Storage)**
- User avatar uploads
- Audio file storage (for speaking practice)
- Document uploads
- File validation and management

### ✅ **Analytics (Firebase Analytics)**
- User behavior tracking
- Performance monitoring
- Custom event tracking

## 🔧 Setup Instructions

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: "IELTS Coach" (or your preferred name)
4. Enable Google Analytics (recommended)
5. Create the project

### 2. Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Enable
   - **Google**: Enable and configure

### 3. Create Firestore Database

1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users

### 4. Enable Storage

1. Go to "Storage"
2. Click "Get started"
3. Choose "Start in test mode"
4. Select the same location as Firestore

### 5. Get Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" → Web app (</> icon)
4. Register your app with a nickname
5. Copy the configuration object

### 6. Environment Variables

Create a `.env` file in your project root with:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your_app_id_here
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id_here

# Google OAuth (if using Google Sign-In)
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## 🔄 Integration with Existing Auth System

### Option 1: Replace Current Auth (Recommended)
Update your `App.jsx` to use Firebase Auth:

```jsx
import { FirebaseAuthProvider } from './context/FirebaseAuthContext';

function App() {
  return (
    <FirebaseAuthProvider>
      <AppProvider>
        <GoogleAuthProvider>
          {/* Your existing app content */}
        </GoogleAuthProvider>
      </AppProvider>
    </FirebaseAuthProvider>
  );
}
```

### Option 2: Keep Both Systems
You can run both authentication systems side by side for testing.

## 📊 Database Schema

### Users Collection
```javascript
{
  uid: "user_id",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "+1234567890",
  dateOfBirth: "1990-01-01",
  country: "US",
  ieltsLevel: "intermediate",
  photoURL: "https://...",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Practice Sessions Collection
```javascript
{
  userId: "user_id",
  sessionType: "listening",
  score: 85,
  duration: 1800,
  questions: [...],
  answers: [...],
  createdAt: timestamp
}
```

### Test Results Collection
```javascript
{
  userId: "user_id",
  testType: "full_test",
  overallScore: 7.5,
  readingScore: 7.0,
  writingScore: 7.5,
  listeningScore: 8.0,
  speakingScore: 7.5,
  completedAt: timestamp
}
```

## 🛠️ Available Functions

### Authentication
```javascript
import { firebaseAuth } from './firebase/auth';

// Sign up
await firebaseAuth.signUp(email, password, userData);

// Sign in
await firebaseAuth.signIn(email, password);

// Google sign in
await firebaseAuth.signInWithGoogle();

// Sign out
await firebaseAuth.signOut();

// Password reset
await firebaseAuth.sendPasswordReset(email);
```

### Database Operations
```javascript
import { userService, practiceService } from './firebase/firestore';

// Create user
await userService.createUser(uid, userData);

// Get user
await userService.getUser(uid);

// Update user
await userService.updateUser(uid, updateData);

// Create practice session
await practiceService.createSession(userId, sessionData);
```

### File Storage
```javascript
import { storageService } from './firebase/storage';

// Upload avatar
await storageService.uploadAvatar(file, userId);

// Upload audio
await storageService.uploadAudio(file, userId, sessionId);

// Upload document
await storageService.uploadDocument(file, userId, 'certificate');
```

## 🔒 Security Rules

### Firestore Rules (for production)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Practice sessions
    match /practiceSessions/{sessionId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Test results
    match /testResults/{resultId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

### Storage Rules (for production)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User avatars
    match /avatars/{fileName} {
      allow read, write: if request.auth != null;
    }
    
    // Audio files
    match /audio/{fileName} {
      allow read, write: if request.auth != null;
    }
    
    // Documents
    match /documents/{fileName} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🧪 Testing

### Test Authentication
```javascript
// Test user registration
const result = await firebaseAuth.signUp(
  'test@example.com', 
  'password123', 
  { firstName: 'Test', lastName: 'User' }
);

// Test user login
const loginResult = await firebaseAuth.signIn('test@example.com', 'password123');
```

### Test Database
```javascript
// Test user creation
const userResult = await userService.createUser('test-uid', {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com'
});
```

## 🚀 Next Steps

1. **Set up Firebase project** following the instructions above
2. **Add environment variables** to your `.env` file
3. **Update App.jsx** to use Firebase Auth
4. **Test authentication** with the provided functions
5. **Configure security rules** for production
6. **Set up analytics** for user tracking

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth Guide](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Storage Guide](https://firebase.google.com/docs/storage)

## 🆘 Troubleshooting

### Common Issues

1. **Configuration Error**: Make sure all environment variables are set correctly
2. **Permission Denied**: Check Firestore and Storage security rules
3. **Google Auth Not Working**: Verify Google OAuth configuration
4. **File Upload Fails**: Check file size limits and validation

### Debug Mode
Enable debug mode by setting `REACT_APP_DEBUG=true` in your environment variables.

---

🎉 **Firebase is now ready to power your IELTS Coach application!**
