const admin = require('firebase-admin');

const initFirebaseAdmin = () => {
  try {
    if (!admin.apps.length) {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

      if (projectId && clientEmail && privateKey) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey
          })
        });
        console.log('Firebase Admin initialized');
      } else {
        console.log('Firebase Admin: credentials not configured, token verification will be skipped');
      }
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error.message);
  }
};

const verifyToken = async (token) => {
  try {
    if (!admin.apps.length) return null;
    const decoded = await admin.auth().verifyIdToken(token);
    return decoded;
  } catch (error) {
    return null;
  }
};

module.exports = { initFirebaseAdmin, verifyToken };
