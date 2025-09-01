// Sample JSON structure for post data storage

export interface CalendarPostData {
  // Core post information
  id: string;
  title: string;
  content: string;
  contentTranslation?: string;
  
  // Scheduling information
  scheduledDate: string; // ISO date format: "2025-09-01"
  scheduledTime?: string; // Time format: "14:30"
  timezone?: string; // e.g., "Europe/Stockholm"
  
  // Publishing platforms
  platforms: string[]; // ["LinkedIn", "Facebook", "Instagram", "X"]
  
  // Content metadata
  style: string; // "Mathias", "Oskar", "Custom"
  language: 'sv' | 'en';
  theme?: string; // "Sales", "AI", "Leadership", etc.
  
  // Post status and workflow
  status: 'scheduled' | 'draft' | 'reshare' | 'published' | 'failed';
  
  // Call-to-action
  cta?: string;
  ctaTranslation?: string;
  
  // Media attachments (future enhancement)
  media?: {
    type: 'image' | 'video' | 'document';
    url: string;
    altText?: string;
    caption?: string;
  }[];
  
  // Analytics and tracking
  engagement?: {
    platform: string;
    likes: number;
    comments: number;
    shares: number;
    views?: number;
    clickThroughs?: number;
  }[];
  
  // Metadata
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  createdBy?: string; // User ID
  tags?: string[]; // ["AI", "Sales", "Automation"]
  
  // Publishing results
  publishResults?: {
    platform: string;
    success: boolean;
    publishedAt?: string; // ISO timestamp
    postUrl?: string; // Direct link to published post
    errorMessage?: string;
  }[];
  
  // Approval workflow (for team environments)
  approval?: {
    status: 'pending' | 'approved' | 'rejected';
    approvedBy?: string;
    approvedAt?: string;
    comments?: string;
  };
}

// Sample data structure for calendar storage
export interface CalendarData {
  posts: CalendarPostData[];
  lastUpdated: string;
  version: string;
}

// Sample JSON for a scheduled post
export const sampleCalendarPost: CalendarPostData = {
  id: "post_20250901_linkedin_ai_pipeline",
  title: "AI Pipeline Management - Mathias Style",
  content: "AI i pipeline-hantering.\n\nSå här använder vi det:\n- Prognoser baserade på historiska data\n- Automatisk riskflagga för deals som ser ut att fastna\n- Realtidsrekommendationer för nästa steg\n\nTidigare gång timmar åt till manuella Excel-blad.\nNu får vi bättre precision – på minuter.\n\nResultat:\n- Mer träffsäkra prognoser\n- Kortare säljcykler",
  contentTranslation: "AI in pipeline management.\n\nHere's how we use it:\n- Forecasts based on historical data\n- Automatic risk flagging for deals that seem stuck\n- Real-time recommendations for next steps\n\nPreviously, hours went to manual Excel sheets.\nNow we get better precision – in minutes.\n\nResults:\n- More accurate forecasts\n- Shorter sales cycles",
  scheduledDate: "2025-09-01",
  scheduledTime: "09:00",
  timezone: "Europe/Stockholm",
  platforms: ["LinkedIn"],
  style: "Mathias",
  language: "sv",
  theme: "Sales Automation",
  status: "scheduled",
  cta: "👉 Tror du AI kan prognostisera bättre än en erfaren säljchef, eller behövs alltid den mänskliga känslan? Kommentera vad du tror.",
  ctaTranslation: "👉 Do you think AI can forecast better than an experienced sales manager, or is human intuition always needed? Comment what you think.",
  tags: ["AI", "Sales", "Pipeline", "Automation"],
  createdAt: "2025-08-25T10:30:00.000Z",
  updatedAt: "2025-08-25T10:30:00.000Z",
  createdBy: "user_mathias_001"
};

// Sample complete calendar data
export const sampleCalendarData: CalendarData = {
  posts: [
    sampleCalendarPost,
    {
      id: "post_20250902_linkedin_followups",
      title: "Follow-up Strategies - Oskar Style",
      content: "För två år sedan hatade jag uppföljningsmejl.\nDet kändes stelt, repetitivt och ofta meningslöst.\n\nIdag skriver jag knappt några själv.\nAI gör det åt mig.",
      scheduledDate: "2025-09-02",
      scheduledTime: "14:30",
      platforms: ["LinkedIn", "Facebook"],
      style: "Oskar",
      language: "sv",
      status: "draft",
      tags: ["Follow-up", "AI", "Sales"],
      createdAt: "2025-08-25T11:00:00.000Z",
      updatedAt: "2025-08-25T11:00:00.000Z"
    }
  ],
  lastUpdated: "2025-08-25T11:00:00.000Z",
  version: "1.0.0"
};

// State management interfaces for React components
export interface CalendarState {
  currentWeek: Date;
  selectedPost: CalendarPostData | null;
  scheduledPosts: CalendarPostData[];
  draggedPost: CalendarPostData | null;
  isEditModalOpen: boolean;
  isAddModalOpen: boolean;
  selectedDate: string;
}

export interface CalendarActions {
  setCurrentWeek: (date: Date) => void;
  selectPost: (post: CalendarPostData | null) => void;
  updatePost: (post: CalendarPostData) => void;
  deletePost: (postId: string) => void;
  createPost: (post: Omit<CalendarPostData, 'id' | 'createdAt' | 'updatedAt'>) => void;
  movePost: (postId: string, newDate: string) => void;
  openEditModal: (post: CalendarPostData) => void;
  openAddModal: (date: string) => void;
  closeModals: () => void;
}