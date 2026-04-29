import { Member, Message, AnalyticsData, MediaItem } from './types';

// Mock Firebase database stored in memory with JSON structure
class MockFirebase {
  private members: Map<string, Member> = new Map();
  private messages: Map<string, Message> = new Map();
  private media: Map<string, MediaItem> = new Map();
  private listeners: Set<Function> = new Set();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize with some sample data
    const sampleMembers: Member[] = [
      {
        id: '1',
        name: 'Nguyễn Văn A',
        jobCategory: 'Công Nghệ Thông Tin',
        jobDetail: 'Senior Developer',
        workUnit: 'Công ty Phần mềm ABC',
        maritalStatus: 'Kết Hôn',
        location: 'Hà Nội',
      },
      {
        id: '2',
        name: 'Trần Thị B',
        jobCategory: 'Kinh Tế - Tài Chính',
        jobDetail: 'Chuyên viên Kế toán',
        workUnit: 'Ngân hàng XYZ',
        maritalStatus: 'Kết Hôn',
        location: 'Sài Gòn',
      },
    ];

    const sampleMessages: Message[] = [
      {
        id: '1',
        memberId: '1',
        memberName: 'Nguyễn Văn A',
        message: 'Rất vui được gặp lại các bạn!',
        timestamp: Date.now() - 3600000,
      },
      {
        id: '2',
        memberId: '2',
        memberName: 'Trần Thị B',
        message: 'Thời gian qua nhanh thật!',
        timestamp: Date.now() - 1800000,
      },
    ];

    sampleMembers.forEach((member) => {
      this.members.set(member.id, member);
    });

    sampleMessages.forEach((message) => {
      this.messages.set(message.id, message);
    });
  }

  // Add new member
  addMember(member: Omit<Member, 'id'>): Member {
    const id = Date.now().toString();
    const newMember: Member = { ...member, id };
    this.members.set(id, newMember);
    this.notifyListeners();
    return newMember;
  }

  // Get all members
  getMembers(): Member[] {
    return Array.from(this.members.values());
  }

  // Add message
  addMessage(message: Omit<Message, 'id' | 'timestamp'>): Message {
    const id = Date.now().toString();
    const newMessage: Message = { ...message, id, timestamp: Date.now() };
    this.messages.set(id, newMessage);
    this.notifyListeners();
    return newMessage;
  }

  // Get all messages
  getMessages(): Message[] {
    return Array.from(this.messages.values()).sort((a, b) => b.timestamp - a.timestamp);
  }

  // Get analytics data
  getAnalytics(): AnalyticsData {
    const members = this.getMembers();
    const messages = this.getMessages();

    const maritalStatus: Record<string, number> = {};
    const jobCategories: Record<string, number> = {};
    const locations: Record<string, number> = {};

    members.forEach((member) => {
      maritalStatus[member.maritalStatus] = (maritalStatus[member.maritalStatus] || 0) + 1;
      jobCategories[member.jobCategory] = (jobCategories[member.jobCategory] || 0) + 1;
      locations[member.location] = (locations[member.location] || 0) + 1;
    });

    return {
      maritalStatus,
      jobCategories,
      locations,
      totalMembers: members.length,
      totalMessages: messages.length,
    };
  }

  // Subscribe to changes
  subscribe(callback: Function): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  // Add media
  addMedia(media: Omit<MediaItem, 'id' | 'timestamp'>): MediaItem {
    const id = Date.now().toString();
    const newMedia: MediaItem = { ...media, id, timestamp: Date.now() };
    this.media.set(id, newMedia);
    
    // Update member with media URLs
    const member = this.members.get(media.memberId);
    if (member) {
      if (media.type === 'photo') {
        if (!member.photoUrls) member.photoUrls = [];
        member.photoUrls.push(media.url);
      } else if (media.type === 'video') {
        member.videoUrl = media.url;
      }
      if (media.caption) {
        member.caption = media.caption;
      }
    }
    
    this.notifyListeners();
    return newMedia;
  }

  // Get all media
  getMedia(): MediaItem[] {
    return Array.from(this.media.values()).sort((a, b) => b.timestamp - a.timestamp);
  }

  // Get media by member ID
  getMediaByMember(memberId: string): MediaItem[] {
    return Array.from(this.media.values())
      .filter(item => item.memberId === memberId)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  // Notify all listeners
  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }
}

// Export singleton instance
export const firebaseDB = new MockFirebase();
