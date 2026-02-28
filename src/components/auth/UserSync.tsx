
'use client';

import { useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

/**
 * A side-effect only component that synchronizes the authenticated user's profile
 * with their Firestore document in /users/{userId}.
 */
export function UserSync() {
  const { user } = useUser();
  const db = useFirestore();

  useEffect(() => {
    if (user && db) {
      const userRef = doc(db, 'users', user.uid);
      
      const userData = {
        id: user.uid,
        googleId: user.providerData.find(p => p.providerId === 'google.com')?.uid || user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Unknown Artist',
        profilePictureUrl: user.photoURL || '',
        updatedAt: serverTimestamp(),
      };

      // CRITICAL: Non-blocking write to sync profile on login
      setDocumentNonBlocking(userRef, userData, { merge: true });
    }
  }, [user, db]);

  return null;
}
