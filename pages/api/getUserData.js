// File: /pages/api/getUserData.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Konfigurasi Firebase menggunakan variabel environment server-side
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export default async function handler(req, res) {
  // Validasi apakah pengguna terotentikasi
  if (!req.query.userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Ambil data pengguna dari Firestore menggunakan userId dari query
    const userId = req.query.userId;
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // Jika dokumen pengguna ditemukan, kirimkan data pengguna
      const userData = userDoc.data();
      return res.status(200).json({ success: true, data: userData });
    } else {
      // Jika pengguna tidak ditemukan
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

export default async function handler(req, res) {
    const userId = req.query.userId;
    
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
  
    // Lanjutkan untuk mengambil data dari Firestore jika pengguna terotentikasi
  }