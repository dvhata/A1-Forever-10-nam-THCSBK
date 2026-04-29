# Media Upload Data Flow Diagram

## Upload Flow

```
User Interaction
       |
       v
MemberForm Component
  ├─ File Input (Photo/Video)
  ├─ Drag & Drop Handler
  ├─ File Validation
  │  ├─ Type check (JPG/PNG/MP4/MOV)
  │  ├─ Count validation (max 3 photos, 1 video)
  │  └─ Preview display
  |
  └─ Form Submission
       |
       v
  File Processing
  ├─ Convert to Base64
  ├─ Update progress bar (30% → 70% → 100%)
  └─ Create MediaItem object
       |
       v
  mockFirebase.addMedia()
  ├─ Generate unique ID
  ├─ Add timestamp
  ├─ Store in media Map
  ├─ Update member record with media URLs
  └─ Notify all listeners
       |
       v
  MediaWall Component (via subscription)
  ├─ Update media list
  ├─ Refresh UI
  └─ Display new media in grid
```

## Data Storage Structure

```
mockFirebase
├─ members: Map<string, Member>
│  └─ Member
│     ├─ id: string
│     ├─ name: string
│     ├─ jobCategory: string
│     ├─ jobDetail: string
│     ├─ workUnit: string
│     ├─ maritalStatus: string
│     ├─ location: string
│     ├─ photoUrls: string[]       [NEW]
│     ├─ videoUrl: string          [NEW]
│     └─ caption: string           [NEW]
│
├─ media: Map<string, MediaItem>   [NEW]
│  └─ MediaItem
│     ├─ id: string
│     ├─ memberId: string
│     ├─ memberName: string
│     ├─ type: 'photo' | 'video'
│     ├─ url: string (Base64)
│     ├─ caption: string
│     └─ timestamp: number
│
├─ messages: Map<string, Message>
│  └─ Message
│     ├─ id: string
│     ├─ memberId: string
│     ├─ memberName: string
│     ├─ message: string
│     └─ timestamp: number
│
└─ listeners: Set<Function>
```

## Component Communication

```
┌─────────────────────────────────────────────────────────────┐
│                      App Page                               │
│  (Orchestrates all sections)                                │
└────────┬────────────────────────────────────────────────────┘
         │
         ├─ Hero
         ├─ RollCall
         ├─ DataHub
         │  └─ MemberForm (UPLOAD HANDLER)
         │     └─ firebaseDB.addMember()
         │     └─ firebaseDB.addMedia()    [NEW]
         │     └─ firebaseDB.addMessage()
         │
         ├─ MessageWall
         ├─ VideoSection
         │
         └─ MediaWall (DISPLAY HANDLER)   [NEW]
            ├─ Subscribe to firebaseDB updates
            ├─ Fetch all media via getMedia()
            ├─ Filter by member
            ├─ Render masonry grid
            └─ Display Polaroid-style cards
```

## Real-time Update Flow

```
MemberForm.handleSubmit()
       |
       ├─ firebaseDB.addMember()
       ├─ firebaseDB.addMedia()      [TRIGGERS NOTIFICATION]
       ├─ firebaseDB.addMessage()
       |
       v
firebaseDB.notifyListeners()
       |
       v
All subscribers are called
       |
       ├─> MediaWall.handleUpdate()
       │   └─ Fetch fresh media list
       │   └─ Re-render component
       │
       ├─> Analytics.handleUpdate()
       │   └─ Recalculate statistics
       │
       └─> (Other subscribers...)
```

## File Upload Processing

```
File Selection
│
├─ User drags files OR clicks input
│
v
handlePhotoDrop() / handlePhotoInput()
│
├─ Validate file type
│ ├─ Check MIME type
│ └─ Check file extension
│
├─ Validate file count
│ └─ Max 3 photos OR 1 video
│
├─ Store in state
│ └─ photoFiles: File[] OR videoFile: File
│
└─ Display preview with preview list
   ├─ File name
   ├─ Remove button
   └─ Progress placeholder


Form Submission
│
v
handleSubmit()
│
├─ Validate required fields
│
├─ For each photo:
│ ├─ convertFileToBase64()
│ ├─ setUploadProgress(30%)
│ ├─ Create MediaItem object
│ ├─ firebaseDB.addMedia()
│ ├─ setUploadProgress(70%)
│ └─ setUploadProgress(100%)
│
├─ For video:
│ ├─ convertFileToBase64()
│ ├─ Create MediaItem object
│ └─ firebaseDB.addMedia()
│
└─ Clear form state
   ├─ Reset formData
   ├─ Clear photoFiles array
   ├─ Clear videoFile
   └─ Reset uploadProgress
```

## MediaWall Display & Filtering

```
MediaWall Component Init
│
├─ Subscribe to firebaseDB
│
├─ handleUpdate()
│ ├─ Fetch all media
│ └─ Set in state
│
├─ useEffect on selectedMember
│ ├─ If 'all': show all media
│ └─ If specific: filter by memberName
│
└─ Render masonry grid
   │
   ├─ For each media item:
   │ ├─ If photo:
   │ │  ├─ Render image
   │ │  ├─ Show Polaroid card
   │ │  └─ Display member name (Dancing Script)
   │ │
   │ └─ If video:
   │    ├─ Render black frame
   │    ├─ Show play button overlay
   │    └─ On click: open modal
   │
   └─ Filter buttons
      ├─ Show unique members
      ├─ Display count per member
      ├─ Highlight selected filter
      └─ Update display on selection
```

## Integration Points

### 1. MemberForm → mockFirebase
```typescript
// Line 178-192: Upload and store media
firebaseDB.addMedia({
  memberId: member.id,
  memberName: member.name,
  type: 'photo',      // or 'video'
  url: base64String,   // File as Base64
  caption: message,    // Optional user caption
});
```

### 2. mockFirebase → MediaWall
```typescript
// MockFirebase.addMedia() triggers notification
this.notifyListeners();

// MediaWall.useEffect listens
const unsubscribe = firebaseDB.subscribe(handleUpdate);
```

### 3. MediaWall Filter → Rendering
```typescript
// Filter by member selection
if (selectedMember === 'all') {
  setFilteredMedia(mediaItems);
} else {
  setFilteredMedia(
    mediaItems.filter((item) => item.memberName === selectedMember)
  );
}
```

## Error Handling

```
File Validation
├─ Type error → Alert user
├─ Size error → Alert user
├─ Count error → Alert user
└─ Preview shows valid files only

Upload Conversion
├─ Base64 error → Catch block
├─ Log error → console.error()
└─ Show error alert to user

Database Operations
├─ AddMember error → Logged in console
├─ AddMedia error → Alert to user
└─ Subscription error → Silent fail (recover on next update)
```

## Performance Optimizations

```
Current Implementation (Can be improved)
├─ Base64 encoding (adds 33% size overhead)
├─ In-memory storage (scales with browser memory)
├─ No image compression
└─ No lazy loading

Recommended Improvements
├─ Switch to Firebase Storage
├─ Implement image compression
├─ Add lazy loading for media
├─ Generate video thumbnails
├─ Cache media in IndexedDB
└─ Implement pagination (limit items per page)
```

## Testing Checklist

- [ ] Upload single photo
- [ ] Upload multiple photos (2-3)
- [ ] Upload video
- [ ] Verify media appears in MediaWall instantly
- [ ] Filter by different members
- [ ] Click video to open modal
- [ ] Test drag & drop upload
- [ ] Test file picker upload
- [ ] Verify progress bar animation
- [ ] Test remove file buttons
- [ ] Try uploading invalid file types
- [ ] Try exceeding file limits
- [ ] Verify success message appears
- [ ] Test on mobile device
- [ ] Test on different browsers
