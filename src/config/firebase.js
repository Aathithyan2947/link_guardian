import admin from 'firebase-admin';

let firebaseApp;

export const initializeFirebase = async () => {
  try {
    if (!firebaseApp) {
      const serviceAccount = {
        type: 'service_account',
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
      };

      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });

      console.log('✅ Firebase Admin initialized successfully');
    }
    return firebaseApp;
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    throw error;
  }
};

export const verifyFirebaseToken = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid Firebase token');
  }
};

export const getFirebaseUser = async (uid) => {
  try {
    const userRecord = await admin.auth().getUser(uid);
    return userRecord;
  } catch (error) {
    throw new Error('Firebase user not found');
  }
};

export default admin;