// Vietnamese class reunion types
export interface Member {
  id: string;
  name: string;
  jobCategory: string;
  jobDetail: string;
  workUnit: string;
  maritalStatus: string;
  location: string;
  photoUrls?: string[];
  videoUrl?: string;
  caption?: string;
}

export interface Message {
  id: string;
  memberId: string;
  memberName: string;
  message: string;
  timestamp: number;
}

export interface AnalyticsData {
  maritalStatus: Record<string, number>;
  jobCategories: Record<string, number>;
  locations: Record<string, number>;
  totalMembers: number;
  totalMessages: number;
}

export interface MediaItem {
  id: string;
  memberId: string;
  memberName: string;
  type: 'photo' | 'video';
  url: string;
  caption?: string;
  timestamp: number;
}

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}
