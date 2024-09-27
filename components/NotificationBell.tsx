"use client";

import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { auth } from "../firebase/firebaseConfig";
import { IoMdNotificationsOutline } from "react-icons/io";
import toast from "react-hot-toast"; // Import library toast untuk menampilkan notifikasi pop-up

interface Notification {
  id: string;
  message: string;
  read: boolean;
  timestamp: any;
}

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const q = query(
        collection(db, `users/${userId}/notifications`),
        where("read", "==", false) // Hanya menampilkan notifikasi yang belum dibaca
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const notificationsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Notification[];
        setNotifications(notificationsData);

        // Tampilkan toast notifikasi untuk setiap notifikasi baru
        notificationsData.forEach((notif) => {
          toast(notif.message, {
            duration: 4000,
            position: 'bottom-right',
            style: { background: '#333', color: '#fff' },
          });
        });
      });

      return () => unsubscribe();
    }
  }, [auth.currentUser]);

  const handleNotificationClick = async () => {
    setShowDropdown(!showDropdown);
    
    if (auth.currentUser && notifications.length > 0) {
      const userId = auth.currentUser.uid;
      const batch = notifications.map(async (notif) => {
        const notifRef = doc(db, `users/${userId}/notifications`, notif.id);
        await updateDoc(notifRef, { read: true });
      });
      await Promise.all(batch);
    }
  };

  return (
    <div className="relative">
      <button onClick={handleNotificationClick} className="relative">
        <IoMdNotificationsOutline size={24} />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-block w-4 h-4 text-xs text-white bg-red-600 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-50">
          <div className="p-4">
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-sm">Tidak ada notifikasi baru.</p>
            ) : (
              <ul className="space-y-2">
                {notifications.map((notif) => (
                  <li key={notif.id} className="p-2 border-b last:border-none">
                    <p className="text-sm">{notif.message}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(notif.timestamp.seconds * 1000).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
