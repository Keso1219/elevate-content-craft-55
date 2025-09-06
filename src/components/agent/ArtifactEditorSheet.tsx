"use client";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Save, 
  Calendar, 
  Plus, 
  X,
  FileText,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PostRow, LeadMagnetIdeaRow, EmailRow } from "@/types/agent";

interface ArtifactEditorSheetProps {
  type: "post" | "idea" | "email";
  item: PostRow | LeadMagnetIdeaRow | EmailRow;
  open: boolean;
  onClose: () => void;
}

export default function ArtifactEditorSheet({ type, item, open, onClose }: ArtifactEditorSheetProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [linkedPosts, setLinkedPosts] = useState<PostRow[]>([]);

  useEffect(() => {
    if (open) {
      setFormData({ ...item });
      
      // Load linked posts for ideas
      if (type === "idea") {
        loadLinkedPosts(item.id);
      }
    }
  }, [open, item, type]);

  const loadLinkedPosts = async (ideaId: string) => {
    try {
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("origin_idea_id", ideaId)
        .order("created_at", { ascending: false });
      
      if (data) setLinkedPosts(data as PostRow[]);
    } catch (error) {
      console.error("Error loading linked posts:", error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData = { ...formData };
      if (type === "post") {
        updateData.updated_at = new Date().toISOString();
        await supabase
          .from("posts")
          .update(updateData)
          .eq("id", item.id);
      } else if (type === "idea") {
        await supabase
          .from("lead_magnet_ideas")
          .update(updateData)
          .eq("id", item.id);
      } else if (type === "email") {
        await supabase
          .from("emails")
          .update(updateData)
          .eq("id", item.id);
      }

      toast({
        title: "Saved",
        description: `${type === "idea" ? "Lead magnet idea" : type} updated successfully`
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSchedule = async () => {
    if (type === "post") {
      const scheduledAt = formData.scheduled_at || new Date(Date.now() + 3600000).toISOString(); // 1 hour from now
      
      setFormData(prev => ({
        ...prev,
        status: "scheduled",
        scheduled_at: scheduledAt
      }));
      
      toast({
        title: "Scheduled",
        description: "Post will be published at the scheduled time"
      });
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePlatformToggle = (platform: string, checked: boolean) => {
    if (type === "post") {
      const currentPlatforms = formData.platforms || [];
      const newPlatforms = checked 
        ? [...currentPlatforms, platform]
        : currentPlatforms.filter(p => p !== platform);
      
      handleFieldChange("platforms", newPlatforms);
    }
  };

  const renderPostEditor = () => {
    const post = formData as PostRow;
    const platforms = ["LinkedIn", "Twitter", "Instagram", "Facebook"];
    
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={post.title || ""}
            onChange={(e) => handleFieldChange("title", e.target.value)}
            placeholder="Post title (optional)"
          />
        </div>

        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={post.content || ""}
            onChange={(e) => handleFieldChange("content", e.target.value)}
            placeholder="Post content"
            rows={8}
          />
        </div>

        <div>
          <Label>Platforms</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {platforms.map((platform) => (
              <div key={platform} className="flex items-center space-x-2">
                <Checkbox
                  id={platform}
                  checked={post.platforms?.includes(platform) || false}
                  onCheckedChange={(checked) => handlePlatformToggle(platform, checked as boolean)}
                />
                <Label htmlFor={platform} className="text-sm">{platform}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={post.status} onValueChange={(value) => handleFieldChange("status", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="writing_style">Writing Style</Label>
            <Select value={post.writing_style || ""} onValueChange={(value) => handleFieldChange("writing_style", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Default">Default</SelectItem>
                <SelectItem value="Oskar-style">Oskar-style</SelectItem>
                <SelectItem value="Mathias-style">Mathias-style</SelectItem>
                <SelectItem value="Professional">Professional</SelectItem>
                <SelectItem value="Casual">Casual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="cta">Call to Action</Label>
          <Input
            id="cta"
            value={post.cta || ""}
            onChange={(e) => handleFieldChange("cta", e.target.value)}
            placeholder="Add a call to action"
          />
        </div>

        {post.status === "scheduled" && (
          <div>
            <Label htmlFor="scheduled_at">Scheduled Date</Label>
            <Input
              id="scheduled_at"
              type="datetime-local"
              value={post.scheduled_at ? new Date(post.scheduled_at).toISOString().slice(0, 16) : ""}
              onChange={(e) => handleFieldChange("scheduled_at", e.target.value ? new Date(e.target.value).toISOString() : null)}
            />
          </div>
        )}
      </div>
    );
  };

  const renderIdeaEditor = () => {
    const idea = formData as LeadMagnetIdeaRow;
    const formats = ["checklist", "guide", "template", "webinar", "calculator", "ebook", "playbook", "report", "other"];
    
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={idea.title || ""}
            onChange={(e) => handleFieldChange("title", e.target.value)}
            placeholder="Lead magnet idea title"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="format">Format</Label>
            <Select value={idea.format} onValueChange={(value) => handleFieldChange("format", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {formats.map((format) => (
                  <SelectItem key={format} value={format} className="capitalize">
                    {format}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={idea.status} onValueChange={(value) => handleFieldChange("status", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="idea">Idea</SelectItem>
                <SelectItem value="validated">Validated</SelectItem>
                <SelectItem value="parked">Parked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="audience">Target Audience</Label>
          <Input
            id="audience"
            value={idea.audience || ""}
            onChange={(e) => handleFieldChange("audience", e.target.value)}
            placeholder="Who is this for?"
          />
        </div>

        <div>
          <Label htmlFor="problem">Problem</Label>
          <Textarea
            id="problem"
            value={idea.problem || ""}
            onChange={(e) => handleFieldChange("problem", e.target.value)}
            placeholder="What problem does this solve?"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="promise">Promise</Label>
          <Textarea
            id="promise"
            value={idea.promise || ""}
            onChange={(e) => handleFieldChange("promise", e.target.value)}
            placeholder="What value does this provide?"
            rows={3}
          />
        </div>

        {/* Linked Posts */}
        {linkedPosts.length > 0 && (
          <div>
            <Label>Linked Posts ({linkedPosts.length})</Label>
            <div className="space-y-2 mt-2">
              {linkedPosts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {post.title || post.content.slice(0, 50) + "..."}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderEmailEditor = () => {
    const email = formData as EmailRow;
    
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={email.subject || ""}
            onChange={(e) => handleFieldChange("subject", e.target.value)}
            placeholder="Email subject"
          />
        </div>

        <div>
          <Label htmlFor="body">Body</Label>
          <Textarea
            id="body"
            value={email.body || ""}
            onChange={(e) => handleFieldChange("body", e.target.value)}
            placeholder="Email content"
            rows={12}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email_type">Email Type</Label>
            <Select value={email.email_type || ""} onValueChange={(value) => handleFieldChange("email_type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Welcome">Welcome</SelectItem>
                <SelectItem value="Nurture">Nurture</SelectItem>
                <SelectItem value="Re-engage">Re-engage</SelectItem>
                <SelectItem value="Newsletter">Newsletter</SelectItem>
                <SelectItem value="Announcement">Announcement</SelectItem>
                <SelectItem value="Generated">Generated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="segment_id">Segment</Label>
            <Input
              id="segment_id"
              value={email.segment_id || ""}
              onChange={(e) => handleFieldChange("segment_id", e.target.value)}
              placeholder="Segment ID (optional)"
            />
          </div>
        </div>
      </div>
    );
  };

  const getTitle = () => {
    switch (type) {
      case "post": return "Edit Post";
      case "idea": return "Edit Lead Magnet Idea";
      case "email": return "Edit Email";
      default: return "Edit Item";
    }
  };

  return (
    <Sheet open={open} onOpenChange={() => onClose()}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{getTitle()}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {type === "post" && renderPostEditor()}
          {type === "idea" && renderIdeaEditor()}
          {type === "email" && renderEmailEditor()}

          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            
            <div className="flex gap-2">
              {type === "post" && (
                <Button
                  variant="outline"
                  onClick={handleSchedule}
                  disabled={saving}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              )}
              
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}