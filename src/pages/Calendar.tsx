import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { WeekNavigation } from "@/components/calendar/WeekNavigation";
import { PostEditModal } from "@/components/calendar/PostEditModal";
import { AddPostModal } from "@/components/calendar/AddPostModal";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from "lucide-react";

export interface ScheduledPost {
  id: string;
  title: string;
  content: string;
  contentTranslation?: string;
  platforms: string[];
  style: string;
  language: 'sv' | 'en';
  status: 'scheduled' | 'draft' | 'reshare';
  scheduledDate: string; // ISO date string
  scheduledTime?: string; // HH:MM format
  cta?: string;
  ctaTranslation?: string;
}

// Mock scheduled posts for demonstration
const mockScheduledPosts: ScheduledPost[] = [
  {
    id: "sched_1",
    title: "AI Pipeline Management",
    content: "AI i pipeline-hantering.\n\nSå här använder vi det:\n- Prognoser baserade på historiska data\n- Automatisk riskflagga för deals som ser ut att fastna\n- Realtidsrekommendationer för nästa steg\n\nTidigare gick timmar åt till manuella Excel-blad.\nNu får vi bättre precision – på minuter.",
    platforms: ["LinkedIn"],
    style: "Mathias",
    language: 'sv',
    status: 'scheduled',
    scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    scheduledTime: "09:00"
  },
  {
    id: "sched_2", 
    title: "Follow-up Strategies",
    content: "För två år sedan hatade jag uppföljningsmejl.\nDet kändes stelt, repetitivt och ofta meningslöst.\n\nIdag skriver jag knappt några själv.\nAI gör det åt mig.",
    platforms: ["LinkedIn", "Facebook"],
    style: "Oskar",
    language: 'sv',
    status: 'draft',
    scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
    scheduledTime: "14:30"
  },
  {
    id: "sched_3",
    title: "Efficiency Mindset",
    content: "När jag började i sälj trodde jag att framgång handlade om att \"jobba hårdare\".\nFler samtal. Fler mejl. Fler timmar.\n\nMen sanningen är att jag brände ut mig.",
    platforms: ["LinkedIn"],
    style: "Oskar",
    language: 'sv',
    status: 'scheduled',
    scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now
    scheduledTime: "11:15"
  }
];

export default function Calendar() {
  const { toast } = useToast();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(mockScheduledPosts);
  const [draggedPost, setDraggedPost] = useState<ScheduledPost | null>(null);

  // Get start of week (Monday)
  const getWeekStart = (date: Date): Date => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
    return new Date(date.setDate(diff));
  };

  // Generate week dates
  const getWeekDates = (startDate: Date): Date[] => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekStart = getWeekStart(new Date(currentWeek));
  const weekDates = getWeekDates(weekStart);

  // Navigation functions
  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeek(newDate);
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  // Post management functions
  const handleEditPost = (post: ScheduledPost) => {
    setSelectedPost(post);
    setEditModalOpen(true);
  };

  const handleAddPost = (date: string) => {
    setSelectedDate(date);
    setAddModalOpen(true);
  };

  const handleUpdatePost = (updatedPost: ScheduledPost) => {
    setScheduledPosts(posts => 
      posts.map(p => p.id === updatedPost.id ? updatedPost : p)
    );
    toast({
      title: "Post updated",
      description: "Your post has been successfully updated."
    });
  };

  const handleDeletePost = (postId: string) => {
    setScheduledPosts(posts => posts.filter(p => p.id !== postId));
    toast({
      title: "Post removed",
      description: "Post has been removed from the calendar."
    });
  };

  const handleCreatePost = (newPost: Omit<ScheduledPost, 'id'>) => {
    const post: ScheduledPost = {
      ...newPost,
      id: `post_${Date.now()}`
    };
    setScheduledPosts(posts => [...posts, post]);
    toast({
      title: "Post scheduled",
      description: "New post has been added to your calendar."
    });
  };

  // Drag and drop functions
  const handleDragStart = (post: ScheduledPost) => {
    setDraggedPost(post);
  };

  const handleDrop = (targetDate: string) => {
    if (draggedPost) {
      const updatedPost = {
        ...draggedPost,
        scheduledDate: targetDate
      };
      handleUpdatePost(updatedPost);
      setDraggedPost(null);
      toast({
        title: "Post moved",
        description: `Post rescheduled to ${new Date(targetDate).toLocaleDateString()}`
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Content Calendar</h1>
            <p className="text-muted-foreground">Plan, schedule, and manage your content across all platforms</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={goToToday} className="text-sm">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Today
            </Button>
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={goToPreviousWeek}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="mx-4 text-sm font-medium text-foreground min-w-[200px] text-center">
                {weekDates[0].toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - {weekDates[6].toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <Button variant="ghost" size="sm" onClick={goToNextWeek}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <CalendarGrid
          weekDates={weekDates}
          scheduledPosts={scheduledPosts}
          onEditPost={handleEditPost}
          onAddPost={handleAddPost}
          onDeletePost={handleDeletePost}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          draggedPost={draggedPost}
        />

        {/* Modals */}
        <PostEditModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          post={selectedPost}
          onSave={handleUpdatePost}
          onDelete={handleDeletePost}
        />

        <AddPostModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          selectedDate={selectedDate}
          onSave={handleCreatePost}
        />
      </div>
    </div>
  );
}