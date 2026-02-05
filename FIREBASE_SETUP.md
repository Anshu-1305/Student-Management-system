# Firebase Integration Setup

## Required Dependencies

Install these dependencies in your project:

```bash
npm install firebase
```

## Firebase Configuration

The Firebase configuration has been set up in `src/firebase/firebaseConfig.js` with your provided credentials:

- **Project ID**: student-managment-system-anshu
- **Auth Domain**: student-managment-system-anshu.firebaseapp.com
- **Storage Bucket**: student-managment-system-anshu.firebasestorage.app

## Features Implemented

### 1. Firebase Authentication
- **Email/Password Login**: Users can login with email and password
- **User Registration**: New users can create accounts
- **Real-time Authentication**: Firebase handles authentication state
- **Password Reset**: Users can reset their passwords

### 2. Firestore Database
- **User Data Storage**: User profiles stored in Firestore
- **Activity Logging**: User activities tracked in real-time
- **Role-based Access**: Different access levels for admin, faculty, student, parent
- **Institute Management**: Multi-tenant support for different institutes

### 3. Real-time Features
- **Live Authentication State**: Automatic login/logout detection
- **Activity Tracking**: Real-time logging of user actions
- **Data Synchronization**: Changes sync across devices

## How It Works

### Login Process
1. User enters email and password
2. Firebase Authentication verifies credentials
3. User data retrieved from Firestore
4. Authentication state updated in React Context
5. User redirected to appropriate dashboard

### Registration Process
1. User fills registration form
2. Firebase Authentication creates user account
3. User data saved to Firestore with role and institute
4. Activity logged for audit trail
5. User automatically logged in

### Data Structure
```
users/{userId}
├── uid: string
├── email: string
├── displayName: string
├── role: string (admin|faculty|student|parent)
├── institute: string
├── createdAt: timestamp
├── lastLogin: timestamp
└── isActive: boolean

users/{userId}/activities/{activityId}
├── type: string (login|signup|logout|profile_update)
├── timestamp: timestamp
└── metadata: object
```

## Security Rules

Make sure to set up Firestore security rules in your Firebase console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own documents
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Users can read/write their own activities
      match /activities/{activityId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## Testing

1. **Install dependencies**: `npm install firebase`
2. **Start development server**: `npm run dev`
3. **Test registration**: Create a new account
4. **Test login**: Login with the created account
5. **Verify data**: Check Firebase Console for user data

## Important Notes

- The UI remains exactly the same as before
- All existing functionality is preserved
- Firebase handles authentication in the background
- User data is persisted in Firestore
- Real-time synchronization across devices
- Activity logging for audit trails

## Next Steps

1. Install Firebase dependencies
2. Test the authentication flow
3. Configure Firestore security rules
4. Set up additional Firebase features if needed (Storage, Functions, etc.)
