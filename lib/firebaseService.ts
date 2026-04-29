import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { MediaItem, Member, Message } from './types';

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
  const safeName = (memberName.trim() || 'unknown')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd').replace(/[^a-zA-Z0-9_]/g, '-').replace(/-+/g, '-');
  const folder = `a1bk/${type}/${safeName}`;

  // Lấy signed params từ server, truyền folder để ký đúng
  const sigRes = await fetch(`/api/upload?folder=${encodeURIComponent(folder)}`);
  if (!sigRes.ok) throw new Error('Không lấy được thông tin upload');
  const { cloudName, apiKey, timestamp, signature } = await sigRes.json();

  const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', String(timestamp));
  formData.append('signature', signature);
  formData.append('folder', folder);

  // Dùng XMLHttpRequest để có progress thực
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve(data.secure_url);
      } else {
        const err = JSON.parse(xhr.responseText);
        reject(new Error(err.error?.message || 'Upload thất bại'));
      }
    };
    xhr.onerror = () => reject(new Error('Lỗi kết nối mạng'));
    xhr.send(formData);
  });
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
