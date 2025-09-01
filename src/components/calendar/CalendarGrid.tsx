import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarPostCard } from "./CalendarPostCard";
import { Plus } from "lucide-react";
import { ScheduledPost } from "@/pages/Calendar";

interface CalendarGridProps {
  weekDates: Date[];
  scheduledPosts: ScheduledPost[];
  onEditPost: (post: ScheduledPost) => void;
  onAddPost: (date: string) => void;
  onDeletePost: (postId: string) => void;
  onDragStart: (post: ScheduledPost) => void;
  onDrop: (targetDate: string) => void;
  draggedPost: ScheduledPost | null;
}

export function CalendarGrid({
  weekDates,
  scheduledPosts,
  onEditPost,
  onAddPost,
  onDeletePost,
  onDragStart,
  onDrop,
  draggedPost
}: CalendarGridProps) {
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const getPostsForDate = (date: Date): ScheduledPost[] => {
    const dateStr = date.toISOString().split('T')[0];
    return scheduledPosts.filter(post => post.scheduledDate === dateStr);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    const dateStr = date.toISOString().split('T')[0];
    onDrop(dateStr);
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 h-[calc(100vh-200px)]">
      {weekDates.map((date, index) => {
        const postsForDate = getPostsForDate(date);
        const dateStr = date.toISOString().split('T')[0];
        
        return (
          <Card
            key={dateStr}
            className={`
              flex flex-col min-h-[400px] p-4 transition-all duration-200
              ${draggedPost ? 'ring-2 ring-primary/20' : ''}
              ${isToday(date) ? 'bg-primary/5 border-primary/30' : ''}
              ${isPastDate(date) ? 'bg-muted/30' : ''}
              hover:shadow-md
            `}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, date)}
          >
            {/* Day Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">
                  {dayNames[index]}
                </span>
                <span className={`
                  text-lg font-bold
                  ${isToday(date) ? 'text-primary' : 'text-foreground'}
                `}>
                  {date.getDate()}
                </span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAddPost(dateStr)}
                className="w-8 h-8 p-0 text-muted-foreground hover:text-foreground"
                disabled={isPastDate(date)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Posts List */}
            <div className="flex-1 space-y-3 overflow-y-auto">
              {postsForDate.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center py-8">
                  <div className="text-muted-foreground">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted/50 flex items-center justify-center">
                      <Plus className="w-5 h-5" />
                    </div>
                    <p className="text-sm">No posts scheduled</p>
                    {!isPastDate(date) && (
                      <p className="text-xs mt-1">Click + to add content</p>
                    )}
                  </div>
                </div>
              ) : (
                postsForDate
                  .sort((a, b) => (a.scheduledTime || '00:00').localeCompare(b.scheduledTime || '00:00'))
                  .map((post) => (
                    <CalendarPostCard
                      key={post.id}
                      post={post}
                      onEdit={() => onEditPost(post)}
                      onDelete={() => onDeletePost(post.id)}
                      onDragStart={() => onDragStart(post)}
                      isPast={isPastDate(date)}
                    />
                  ))
              )}
            </div>

            {/* Add Post Button */}
            {!isPastDate(date) && postsForDate.length > 0 && (
              <div className="mt-4 pt-3 border-t border-border/50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddPost(dateStr)}
                  className="w-full text-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Post
                </Button>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}