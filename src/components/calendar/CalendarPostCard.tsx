import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit3, Trash2, Clock, CheckCircle, RotateCcw, GripVertical } from "lucide-react";
import { ScheduledPost } from "@/pages/Calendar";

interface CalendarPostCardProps {
  post: ScheduledPost;
  onEdit: () => void;
  onDelete: () => void;
  onDragStart: () => void;
  isPast: boolean;
}

export function CalendarPostCard({ 
  post, 
  onEdit, 
  onDelete, 
  onDragStart, 
  isPast 
}: CalendarPostCardProps) {
  
  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'facebook':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200';
      case 'instagram':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      case 'x':
      case 'twitter':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusIcon = () => {
    switch (post.status) {
      case 'scheduled':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'draft':
        return <Clock className="w-3 h-3 text-yellow-500" />;
      case 'reshare':
        return <RotateCcw className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = () => {
    switch (post.status) {
      case 'scheduled':
        return 'Scheduled';
      case 'draft':
        return 'Draft';
      case 'reshare':
        return 'Reshare';
      default:
        return post.status;
    }
  };

  const truncateContent = (content: string, maxLength: number = 80) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <Card 
      className={`
        p-3 cursor-move transition-all duration-200 group
        ${isPast ? 'opacity-70' : ''}
        hover:shadow-md hover:scale-[1.02]
      `}
      draggable={!isPast}
      onDragStart={onDragStart}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <div className="flex items-center gap-1 flex-1 min-w-0">
            {getStatusIcon()}
            <span className="text-xs font-medium text-muted-foreground truncate">
              {post.title}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="w-6 h-6 p-0 hover:bg-muted"
          >
            <Edit3 className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="w-6 h-6 p-0 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Time */}
      {post.scheduledTime && (
        <div className="flex items-center gap-1 mb-2">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium">
            {post.scheduledTime}
          </span>
        </div>
      )}

      {/* Content Preview */}
      <p className="text-sm text-foreground mb-3 leading-relaxed">
        {truncateContent(post.content)}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 flex-wrap">
          {post.platforms.map((platform) => (
            <Badge
              key={platform}
              variant="secondary"
              className={`text-xs px-2 py-0.5 ${getPlatformColor(platform)}`}
            >
              {platform}
            </Badge>
          ))}
        </div>

        <Badge variant="outline" className="text-xs">
          {getStatusLabel()}
        </Badge>
      </div>

      {/* Style indicator */}
      <div className="mt-2 pt-2 border-t border-border/50">
        <span className="text-xs text-muted-foreground">
          Style: <span className="font-medium">{post.style}</span>
        </span>
      </div>
    </Card>
  );
}