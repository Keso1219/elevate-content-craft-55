"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Edit, 
  Calendar, 
  Download, 
  Trash2, 
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PostRow, LeadMagnetIdeaRow, EmailRow } from "@/types/agent";

interface ArtifactItemCardProps {
  type: "post" | "idea" | "email";
  item: PostRow | LeadMagnetIdeaRow | EmailRow;
  relatedPosts?: PostRow[];
  onEdit: () => void;
  onRefresh: () => void;
}

export default function ArtifactItemCard({ 
  type, 
  item, 
  relatedPosts = [],
  onEdit, 
  onRefresh 
}: ArtifactItemCardProps) {
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async () => {
    try {
      if (type === "post") {
        await supabase.from("posts").delete().eq("id", item.id);
      } else if (type === "idea") {
        await supabase.from("lead_magnet_ideas").delete().eq("id", item.id);
      } else if (type === "email") {
        await supabase.from("emails").delete().eq("id", item.id);
      }
      onRefresh();
      
      toast({
        title: "Deleted",
        description: `${type === "idea" ? "Lead magnet idea" : type} deleted successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive"
      });
    }
  };

  const handleSchedule = async () => {
    // Schedule logic for posts
    if (type === "post") {
      toast({
        title: "Schedule",
        description: "Scheduling feature coming soon"
      });
    }
  };

  const handleExport = () => {
    const content = getItemContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${getItemTitle()}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Exported",
      description: "Content exported successfully"
    });
  };

  const getItemTitle = () => {
    if (type === "post") {
      const post = item as PostRow;
      return post.title || post.content.slice(0, 50) + "...";
    } else if (type === "idea") {
      const idea = item as LeadMagnetIdeaRow;
      return idea.title;
    } else if (type === "email") {
      const email = item as EmailRow;
      return email.subject;
    }
    return "";
  };

  const getItemContent = () => {
    if (type === "post") {
      const post = item as PostRow;
      return post.content;
    } else if (type === "idea") {
      const idea = item as LeadMagnetIdeaRow;
      return `${idea.title}\n\nFormat: ${idea.format}\nAudience: ${idea.audience || 'Not specified'}\nProblem: ${idea.problem || 'Not specified'}\nPromise: ${idea.promise || 'Not specified'}`;
    } else if (type === "email") {
      const email = item as EmailRow;
      return `Subject: ${email.subject}\n\n${email.body}`;
    }
    return "";
  };

  const getStatusIcon = () => {
    if (type === "post") {
      const post = item as PostRow;
      switch (post.status) {
        case "published": return <CheckCircle className="h-3 w-3 text-green-500" />;
        case "scheduled": return <Clock className="h-3 w-3 text-blue-500" />;
        case "error": return <AlertCircle className="h-3 w-3 text-red-500" />;
        default: return <Edit className="h-3 w-3 text-muted-foreground" />;
      }
    } else if (type === "idea") {
      const idea = item as LeadMagnetIdeaRow;
      switch (idea.status) {
        case "validated": return <CheckCircle className="h-3 w-3 text-green-500" />;
        case "parked": return <Clock className="h-3 w-3 text-yellow-500" />;
        default: return <Edit className="h-3 w-3 text-muted-foreground" />;
      }
    }
    return <Edit className="h-3 w-3 text-muted-foreground" />;
  };

  const getStatusBadge = () => {
    if (type === "post") {
      const post = item as PostRow;
      return (
        <Badge 
          variant={post.status === "published" ? "default" : "secondary"}
          className="text-xs capitalize"
        >
          {post.status}
        </Badge>
      );
    } else if (type === "idea") {
      const idea = item as LeadMagnetIdeaRow;
      return (
        <Badge 
          variant={idea.status === "validated" ? "default" : "secondary"}
          className="text-xs capitalize"
        >
          {idea.status}
        </Badge>
      );
    } else if (type === "email") {
      const email = item as EmailRow;
      return (
        <Badge variant="secondary" className="text-xs">
          {email.email_type || "Draft"}
        </Badge>
      );
    }
    return null;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {getStatusIcon()}
              <h3 className="font-medium text-sm truncate">
                {getItemTitle()}
              </h3>
            </div>
            {getStatusBadge()}
          </div>

          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {type === "post" && (item as PostRow).content.slice(0, 100)}
            {type === "idea" && (
              <>
                {(item as LeadMagnetIdeaRow).format} • {(item as LeadMagnetIdeaRow).audience}
              </>
            )}
            {type === "email" && (item as EmailRow).body.slice(0, 100)}
            {getItemContent().length > 100 && "..."}
          </p>

          {/* Related posts for ideas */}
          {type === "idea" && relatedPosts.length > 0 && (
            <div className="mb-3">
              <Badge variant="outline" className="text-xs">
                <FileText className="h-3 w-3 mr-1" />
                {relatedPosts.length} post{relatedPosts.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          )}

          {/* Platform badges for posts */}
          {type === "post" && (item as PostRow).platforms.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {(item as PostRow).platforms.map((platform) => (
                <Badge key={platform} variant="outline" className="text-xs">
                  {platform}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {formatDate(item.created_at)}
            </span>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" onClick={onEdit} className="h-6 w-6 p-0">
                <Edit className="h-3 w-3" />
              </Button>
              
              {type === "post" && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSchedule}
                  className="h-6 w-6 p-0"
                >
                  <Calendar className="h-3 w-3" />
                </Button>
              )}
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleExport}
                className="h-6 w-6 p-0"
              >
                <Download className="h-3 w-3" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDelete}
                className="h-6 w-6 p-0 text-red-400 hover:text-red-600"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}