import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from './firebase';
import { MediaItem, Member, Message } from './types';

const toSafePath = (value: string) => value.trim().replace(/\s+/g, '-');

export async function addMember(member: Omit<Member, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'members'), {
    ...member,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function addMessage(message: Omit<Message, 'id' | 'timestamp'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'messages'), {
    ...message,
    timestamp: Date.now(),
  });
  return docRef.id;
}

export async function uploadMediaFile(
  file: File,
  memberName: string,
  type: MediaItem['type'],
  onProgress?: (progress: number) => void
): Promise<string> {
  const safeName = toSafePath(memberName || 'unknown');
  const filePath = `media/${type}/${safeName}/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, filePath);
  onProgress?.(0);
  const task = uploadBytesResumable(storageRef, file, {
    contentType: file.type || undefined,
  });

  try {
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Upload timeout'));
      }, 5 * 60 * 1000);

      task.on(
        'state_changed',
        (snapshot) => {
          if (!onProgress) return;
          const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          onProgress(percent);
        },
        (error) => {
          clearTimeout(timeout);
          reject(error);
        },
        () => {
          clearTimeout(timeout);
          resolve();
        }
      );
    });

    return getDownloadURL(task.snapshot.ref);
  } catch (error) {
    console.error('Firebase upload failed:', error);
    throw error;
  }
}

export async function addMedia(media: Omit<MediaItem, 'id' | 'timestamp'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'media'), {
    ...media,
    timestamp: Date.now(),
  });
  return docRef.id;
}

export function subscribeToMedia(callback: (items: MediaItem[]) => void): Unsubscribe {
  const q = query(collection(db, 'media'), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items: MediaItem[] = snapshot.docs.map((doc) => {
      const data = doc.data() as Omit<MediaItem, 'id'>;
      return { id: doc.id, ...data };
    });
    callback(items);
  });
}

export function subscribeToMessages(callback: (items: Message[]) => void): Unsubscribe {
  const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items: Message[] = snapshot.docs.map((doc) => {
      const data = doc.data() as Omit<Message, 'id'>;
      return { id: doc.id, ...data };
    });
    callback(items);
  });
}

export function subscribeToMembers(callback: (items: Member[]) => void): Unsubscribe {
  const q = query(collection(db, 'members'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items: Member[] = snapshot.docs.map((doc) => {
      const data = doc.data() as Omit<Member, 'id'>;
      return { id: doc.id, ...data };
    });
    callback(items);
  });
}
