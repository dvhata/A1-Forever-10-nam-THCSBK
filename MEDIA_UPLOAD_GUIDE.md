# Media Upload & Memory Wall Integration Guide

## Overview
This document explains the media upload system and the new Memory Wall feature integrated into the reunion application.

## Features Implemented

### 1. Media Upload System

#### File Types Supported:
- **Photos**: JPG, PNG (up to 3 files per submission)
- **Videos**: MP4, MOV (1 video per submission)

#### Upload Methods:
1. **Drag & Drop Zone** - Drag photos directly onto the upload area
2. **File Picker** - Click to browse and select files
3. **Progress Bar** - Real-time upload progress visualization in Orange (#FF6B00)

#### Technical Implementation:
- Files are converted to Base64 for storage in mock Firebase
- File validation occurs on both selection and submission
- Upload progress is tracked per file
- Failed uploads show error messages to users

### 2. Data Model Updates

#### Member Type Extended:
```typescript
interface Member {
  id: string;
  name: string;
  jobCategory: string;
  jobDetail: string;
  workUnit: string;
  maritalStatus: string;
  location: string;
  photoUrls?: string[];     // Array of photo URLs
  videoUrl?: string;        // Single video URL
  caption?: string;         // Member's message/caption
}
```

#### New MediaItem Type:
```typescript
interface MediaItem {
  id: string;
  memberId: string;
  memberName: string;
  type: 'photo' | 'video';
  url: string;              // Base64 encoded file data
  caption?: string;
  timestamp: number;
}
```

### 3. MemberForm Refactor

#### New Fields Added:
1. **Photo Upload Section**
   - Drag & drop zone with visual feedback
   - File preview with progress bar
   - Remove button for each photo
   - Limit validation (max 3 files)

2. **Video Upload Section**
   - Single video input with file preview
   - Progress bar during upload
   - Remove button to clear selection
   - File type validation (MP4/MOV only)

#### Form Validation:
- All required fields must be filled
- Photo and video files are optional
- Duplicate member submission prevention
- File size and type validation

#### Upload Process:
1. User selects/drops files
2. Files are validated on selection
3. On form submission, files are converted to Base64
4. Progress bar updates during conversion
5. Media is stored in mock Firebase
6. Media URLs are attached to member record
7. Success message appears after upload

### 4. MediaWall Component

#### Layout:
- **Masonry Grid**: 12-column responsive grid
  - 2 cols on mobile (2 columns wide each)
  - 4 cols on tablet (2 columns wide each)
  - 6 cols on desktop (2 columns wide each, videos span 3 cols)

#### Photo Cards (Polaroid Style):
- Image on top
- Member name in Dancing Script font
- Caption text below (if provided)
- Timestamp in Orange
- Orange left border for branding
- Hover effect: scale up on hover

#### Video Cards:
- Wider layout (spans 3 columns on desktop)
- Aspect ratio 16:9
- Play button overlay in Orange
- Member name and caption below
- Click to open full-screen video player

#### Filter Feature:
- "All Media" button shows total count
- Individual member buttons (max 8 visible)
- Shows count per member
- "+N more" indicator for additional members
- Instant filtering without page reload

#### Video Modal:
- Full-screen video player
- HTML5 video controls (play, pause, fullscreen)
- Member info displayed below video
- Click outside to close
- Close button in top right

### 5. Database Integration

#### MockFirebase Methods Added:
```typescript
// Add media to database
addMedia(media: Omit<MediaItem, 'id' | 'timestamp'>): MediaItem

// Get all media (sorted by timestamp, newest first)
getMedia(): MediaItem[]

// Get media by specific member
getMediaByMember(memberId: string): MediaItem[]
```

#### Automatic Updates:
- When media is added, member record is updated with media URLs
- Real-time notification system triggers updates
- All subscribed components refresh automatically

### 6. Branding & Typography

#### Color Scheme:
- **Primary**: Orange (#FF6B00) - Progress bars, buttons, play buttons
- **Secondary**: Navy (#0A1F44) - Video frames, text
- **Accents**: Cream White (#FFFBF5), Beige (#E8DDD0)

#### Typography:
- **Headers**: Playfair Display (section titles)
- **Body**: Montserrat (form labels, descriptions)
- **Captions**: Dancing Script (member names on media cards)

### 7. User Experience Features

#### Upload Feedback:
- Real-time progress bars for each file
- Upload completion status
- Success message with green background
- Error messages for failed uploads

#### Visual Feedback:
- Drag & drop zone changes color on hover
- Progress bars fill with orange color
- Buttons change appearance on hover
- Video play button scales up on card hover

#### Empty States:
- Friendly message when no media is uploaded
- Encourages users to upload first
- Maintains brand voice with Vietnamese copy

## File Structure

### New Files:
- `components/MediaWall.tsx` - Main media display and filtering component
- `MEDIA_UPLOAD_GUIDE.md` - This documentation file

### Modified Files:
- `components/MemberForm.tsx` - Added photo and video upload sections
- `lib/types.ts` - Added MediaItem and UploadProgress types
- `lib/mockFirebase.ts` - Added media storage and retrieval methods
- `app/page.tsx` - Replaced MemoryLane with MediaWall

## Future Enhancements

1. **Real Firebase Storage**: Replace Base64 with firebase/storage for production
2. **Compression**: Add image/video compression before upload
3. **Lazy Loading**: Implement lazy loading for large image galleries
4. **Thumbnails**: Generate video thumbnails from frames
5. **Analytics**: Track upload counts and popular members
6. **Moderation**: Admin approval for user-uploaded media

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (video controls may vary)
- Mobile browsers: Responsive design, touch-friendly

## Performance Considerations

- Base64 encoding adds ~33% size overhead
- Consider switching to Firebase Storage for production
- Lazy load images as user scrolls
- Video streaming from CDN recommended for production

## Security Notes

- Client-side file validation is a UX feature, not security
- For production, implement server-side validation
- Use Firebase Security Rules for storage access control
- Sanitize user captions to prevent XSS attacks

## Support & Maintenance

For questions or issues:
1. Check the code comments for implementation details
2. Review the TypeScript types for data structure
3. Test upload functionality with various file formats
4. Monitor browser console for any errors
