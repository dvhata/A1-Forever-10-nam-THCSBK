# Professional Code Patterns - Class Reunion App

## Overview

This document provides reusable code patterns and best practices used throughout the refactored application.

---

## 1. Data Listening Pattern

### useEffect with Subscription

**Pattern:** Subscribe to data changes with proper cleanup
```tsx
export function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    // Initial data load
    setAnalytics(firebaseDB.getAnalytics());
    
    // Subscribe to changes
    const unsubscribe = firebaseDB.subscribe(() => {
      setAnalytics(firebaseDB.getAnalytics());
    });
    
    // Cleanup subscription on unmount
    return unsubscribe;
  }, []); // Empty dependency array = run once on mount

  if (!analytics) return null;
  
  return (/* JSX */);
}
```

**Benefits:**
- Automatic cleanup prevents memory leaks
- Reactive data updates
- Single source of truth from Firebase
- Proper React lifecycle management

---

## 2. Data Transformation with Reduce

### Converting Objects to Arrays

**Pattern:** Use reduce to transform data structure
```tsx
// Transform object counts to array format for Recharts
const maritalStatusData = Object.entries(analytics.maritalStatus).reduce(
  (acc, [name, value]) => [...acc, { name, value }],
  [] as Array<{ name: string; value: number }>
);
```

**Alternative: Count & Transform in One Pass**
```tsx
// If data is raw, calculate counts while transforming
const statusCounts = members.reduce(
  (acc, member) => {
    const status = member.maritalStatus || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  },
  {} as Record<string, number>
);

// Then convert to array
const statusData = Object.entries(statusCounts).map(([name, value]) => ({
  name,
  value,
}));
```

**Benefits:**
- Functional programming approach
- Immutable data transformation
- Combines filtering, mapping, and counting in one operation

---

## 3. Form State Management

### Controlled Input Pattern

**Pattern:** Manage form state with useState and handleChange
```tsx
const [formData, setFormData] = useState({
  name: '',
  jobCategory: '',
  jobDetail: '',
  workUnit: '',
  maritalStatus: '',
  location: '',
  message: '',
});

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

// In JSX:
<input
  name="jobDetail"
  value={formData.jobDetail}
  onChange={handleChange}
/>
```

**Benefits:**
- Single source of truth
- Easy form reset
- Simple validation
- Clear data flow

---

## 4. Searchable Dropdown Pattern

### Filtered List with Memoization

**Pattern:** Filter options based on search query
```tsx
const [searchQuery, setSearchQuery] = useState('');
const [showDropdown, setShowDropdown] = useState(false);

// Memoize filtered results for performance
const filteredMembers = useMemo(() => {
  if (!searchQuery.trim()) return availableMembers;
  return availableMembers.filter(member =>
    member.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [searchQuery, availableMembers]);

// In JSX:
<input
  type="text"
  placeholder="Search..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onFocus={() => setShowDropdown(true)}
/>

{showDropdown && filteredMembers.length > 0 && (
  <div className="absolute mt-1 bg-white border rounded-lg shadow-lg z-10">
    {filteredMembers.map((member) => (
      <button
        key={member}
        onClick={() => selectMember(member)}
        type="button"
      >
        {member}
      </button>
    ))}
  </div>
)}
```

**Benefits:**
- Real-time search feedback
- Performance optimized with useMemo
- Keyboard-friendly
- Accessible dropdown

---

## 5. Duplicate Prevention Pattern

### Track Submitted Items with Set

**Pattern:** Use Set to prevent duplicate submissions
```tsx
const [submittedMembers, setSubmittedMembers] = useState<Set<string>>(new Set());

// Check if already submitted
if (submittedMembers.has(formData.name)) {
  alert('Member already submitted!');
  return;
}

// Add to submitted after success
setSubmittedMembers((prev) => new Set([...prev, formData.name]));

// Display count
<p>Submitted: {submittedMembers.size} members</p>
```

**Benefits:**
- O(1) lookup time
- Prevents duplicate data
- User-friendly feedback
- Immutable update pattern

---

## 6. Conditional Styling Pattern

### Dynamic Classes with Template Literals

**Pattern:** Apply styles conditionally
```tsx
<div
  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
    hoveredMember === member
      ? 'bg-[#FF6B00] text-white border-[#FF6B00] scale-105 shadow-lg'
      : 'bg-[#FFFBF5] text-[#0A1F44] hover:border-[#FF6B00]'
  }`}
>
  {member}
</div>
```

**Alternative: Using cn() utility**
```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  "p-4 rounded-lg border-2 transition-all duration-300",
  hoveredMember === member
    ? "bg-[#FF6B00] text-white border-[#FF6B00] scale-105 shadow-lg"
    : "bg-[#FFFBF5] text-[#0A1F44] hover:border-[#FF6B00]"
)}>
  {member}
</div>
```

**Benefits:**
- Clear conditional logic
- Easy to maintain
- Responsive to state changes
- Type-safe with TypeScript

---

## 7. Async Form Submission Pattern

### Loading State & Validation

**Pattern:** Handle async submission with loading state
```tsx
const [loading, setLoading] = useState(false);
const [submitted, setSubmitted] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validation
  if (!formData.name || !formData.jobCategory) {
    alert('Please fill all required fields!');
    return;
  }

  setLoading(true);

  // Simulate API call
  setTimeout(() => {
    firebaseDB.addMember(formData);
    
    setSubmitted(true);
    setLoading(false);
    
    // Reset form
    setFormData({ name: '', jobCategory: '', ... });
    
    // Clear success message after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  }, 500);
};

// In JSX:
<button disabled={loading}>
  {loading ? 'Sending...' : 'Submit'}
</button>

{submitted && <div className="success-message">Success!</div>}
```

**Benefits:**
- User feedback during submission
- Prevents double submissions
- Clear error messaging
- Success confirmation

---

## 8. Responsive Grid Pattern

### Mobile-First 12-Column Grid

**Pattern:** Define grid breakpoints for responsive layout
```tsx
<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
  {items.map((item) => (
    <div
      key={item.id}
      className="col-span-2 sm:col-span-2 lg:col-span-2"
    >
      {/* Card content */}
    </div>
  ))}
</div>

// For masonry layout with variable spans:
{/* Large items span 3 columns on desktop */}
<div className="col-span-2 sm:col-span-2 lg:col-span-3 lg:row-span-2">
  {/* Large card */}
</div>
```

**Benefits:**
- Truly responsive design
- Mobile-first approach
- Uses Tailwind's breakpoints
- Predictable grid system

---

## 9. Color Management Pattern

### Centralized Color Constants

**Pattern:** Store colors in constants file
```tsx
// lib/constants.ts
export const COLORS = {
  primary: '#FF6B00',        // Vibrant Orange
  secondary: '#0A1F44',      // Deep Navy
  tertiary: '#FFFBF5',       // Cream White
  orange: '#FF6B00',
  orangeDark: '#E55A00',
  orangeLight: '#FFB84D',
  border: '#E8DDD0',
};

// Usage in components:
style={{ backgroundColor: COLORS.primary }}
style={{ borderColor: COLORS.border }}
```

**Benefits:**
- Consistent branding
- Single source of truth
- Easy theme changes
- Type-safe color values

---

## 10. Chart Styling Pattern

### Recharts Custom Colors

**Pattern:** Apply custom colors to charts
```tsx
const CHART_COLORS = [
  COLORS.orange,      // #FF6B00
  COLORS.orangeDark,  // #E55A00
  COLORS.orangeLight, // #FFB84D
  '#FF8A3D',
  '#FFB366',
  '#FFD9B3',
];

// In PieChart:
<Pie data={data} fill="#8884d8">
  {data.map((_, index) => (
    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
  ))}
</Pie>

// In BarChart:
<Bar dataKey="value" fill={COLORS.orange} radius={[8, 8, 0, 0]} />
```

**Benefits:**
- Consistent chart branding
- Color cycling for multiple series
- Easy to customize
- Accessible color contrasts

---

## 11. Typography Application Pattern

### Font Family Usage

**Pattern:** Apply different fonts for different purposes
```tsx
// Headers - Playfair Display
<h1 className="font-playfair text-5xl font-bold">Main Title</h1>
<h2 className="font-playfair text-3xl font-semibold">Section Title</h2>

// Body Text - Montserrat (default)
<p className="font-montserrat text-base">Regular paragraph</p>
<label className="font-montserrat text-sm font-semibold">Form Label</label>

// Emotional Elements - Dancing Script
<p className="font-dancing text-lg">Teacher Name</p>
<p className="font-dancing italic">Inspirational Quote</p>
```

**Benefits:**
- Clear visual hierarchy
- Emotional impact
- Professional appearance
- Accessibility-friendly

---

## 12. Error Handling Pattern

### Form Validation

**Pattern:** Validate before submission
```tsx
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  // Check required fields
  if (!formData.name) {
    alert('Name is required!');
    return;
  }

  if (!formData.jobDetail.trim()) {
    alert('Please enter job details!');
    return;
  }

  // Check business logic
  if (submittedMembers.has(formData.name)) {
    alert('This member has already submitted!');
    return;
  }

  // Proceed with submission
  submitForm();
};
```

**Benefits:**
- User-friendly error messages
- Prevents invalid data submission
- Clear validation feedback
- Improved UX

---

## 13. Component Composition Pattern

### Prop Interface & Default Props

**Pattern:** Define clear component contracts
```tsx
interface VideoSectionProps {
  videos?: Video[];
}

interface Video {
  id: string;
  title: string;
  type: 'youtube' | 'mp4';
  url: string;
  thumbnail?: string;
}

export default function VideoSection({ videos = [] }: VideoSectionProps) {
  const displayVideos = videos.length > 0 ? videos : defaultVideos;
  
  return (/* JSX */);
}

// Usage:
<VideoSection videos={customVideos} />
<VideoSection /> {/* Uses default videos */}
```

**Benefits:**
- Type-safe props
- Clear API contract
- Reusable component
- Easy to test

---

## 14. Performance Optimization

### Memoization Pattern

**Pattern:** Prevent unnecessary re-renders
```tsx
import { useMemo, useCallback } from 'react';

// Memoize computed values
const availableMembers = useMemo(() => {
  return CLASS_MEMBERS.filter(member => !submittedMembers.has(member));
}, [submittedMembers]);

// Memoize callbacks
const selectMember = useCallback((memberName: string) => {
  setFormData((prev) => ({ ...prev, name: memberName }));
  setShowDropdown(false);
}, []);

// Use in event handlers
<button onClick={() => selectMember(member)}>Select</button>
```

**Benefits:**
- Improved performance
- Reduced re-renders
- Better memory usage
- Smooth user interactions

---

## 15. State Reset Pattern

### Form Reset After Submission

**Pattern:** Clear form state after successful submission
```tsx
const resetForm = () => {
  setFormData({
    name: '',
    jobCategory: '',
    jobDetail: '',
    workUnit: '',
    maritalStatus: '',
    location: '',
    message: '',
  });
  setSearchQuery('');
  setShowDropdown(false);
};

// After successful submission:
setTimeout(() => {
  setSubmitted(true);
  resetForm();
  
  // Clear success message
  setTimeout(() => setSubmitted(false), 3000);
}, 500);
```

**Benefits:**
- Clean UI after submission
- Prevents data leakage
- User-friendly experience
- Clear for new submissions

---

## Best Practices Summary

### Code Organization
- ✅ One component per file
- ✅ Clear, descriptive names
- ✅ Logical prop organization
- ✅ Proper imports/exports

### Performance
- ✅ Use useMemo for computed values
- ✅ Use useCallback for event handlers
- ✅ Avoid unnecessary re-renders
- ✅ Lazy load when possible

### UX/UI
- ✅ Provide user feedback
- ✅ Handle loading states
- ✅ Show error messages
- ✅ Clear success indicators

### Code Quality
- ✅ Use TypeScript for safety
- ✅ Proper error handling
- ✅ Consistent formatting
- ✅ Clear comments

---

## Testing These Patterns

Example test structure for the MemberForm component:

```tsx
describe('MemberForm', () => {
  it('should filter members based on search', () => {
    // Test searchable dropdown
  });

  it('should prevent duplicate submission', () => {
    // Test Set-based duplicate prevention
  });

  it('should validate required fields', () => {
    // Test form validation
  });

  it('should show loading state during submission', () => {
    // Test async submission pattern
  });

  it('should reset form after successful submission', () => {
    // Test form reset
  });
});
```

---

## Conclusion

These patterns form the foundation of the refactored application's code quality. They provide:
- Scalability for future features
- Maintainability for the development team
- Performance optimizations
- Professional code standards
- Clear best practices for new contributors
