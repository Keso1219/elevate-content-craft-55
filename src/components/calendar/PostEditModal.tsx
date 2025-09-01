import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Globe, Trash2, Save, Calendar, Clock } from "lucide-react";
import { ScheduledPost } from "@/pages/Calendar";

interface PostEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: ScheduledPost | null;
  onSave: (post: ScheduledPost) => void;
  onDelete: (postId: string) => void;
}

const availablePlatforms = [
  { id: 'LinkedIn', name: 'LinkedIn', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
  { id: 'Facebook', name: 'Facebook', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' },
  { id: 'Instagram', name: 'Instagram', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300' },
  { id: 'X', name: 'X (Twitter)', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' }
];

const statusOptions = [
  { value: 'scheduled', label: 'Scheduled', icon: '✅' },
  { value: 'draft', label: 'Draft', icon: '🕒' },
  { value: 'reshare', label: 'Reshare', icon: '🔁' }
] as const;

export function PostEditModal({ isOpen, onClose, post, onSave, onDelete }: PostEditModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    contentTranslation: '',
    platforms: [] as string[],
    style: '',
    language: 'sv' as 'sv' | 'en',
    status: 'scheduled' as 'scheduled' | 'draft' | 'reshare',
    scheduledDate: '',
    scheduledTime: '',
    cta: '',
    ctaTranslation: ''
  });

  const [showTranslation, setShowTranslation] = useState(false);

  // Update form data when post changes
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        contentTranslation: post.contentTranslation || '',
        platforms: post.platforms,
        style: post.style,
        language: post.language,
        status: post.status,
        scheduledDate: post.scheduledDate,
        scheduledTime: post.scheduledTime || '',
        cta: post.cta || '',
        ctaTranslation: post.ctaTranslation || ''
      });
      setShowTranslation(!!(post.contentTranslation || post.ctaTranslation));
    }
  }, [post]);

  const handleSave = () => {
    if (!post) return;

    const updatedPost: ScheduledPost = {
      ...post,
      title: formData.title,
      content: formData.content,
      contentTranslation: showTranslation ? formData.contentTranslation : undefined,
      platforms: formData.platforms,
      style: formData.style,
      language: formData.language,
      status: formData.status,
      scheduledDate: formData.scheduledDate,
      scheduledTime: formData.scheduledTime,
      cta: formData.cta,
      ctaTranslation: showTranslation ? formData.ctaTranslation : undefined
    };

    onSave(updatedPost);
    onClose();
  };

  const handleDelete = () => {
    if (post && window.confirm('Are you sure you want to delete this post?')) {
      onDelete(post.id);
      onClose();
    }
  };

  const togglePlatform = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Edit Scheduled Post
          </DialogTitle>
          <DialogDescription>
            Update your post content, timing, and platform settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Post Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter a descriptive title..."
            />
          </div>

          {/* Scheduling */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Scheduled Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Scheduled Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.scheduledTime}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
              />
            </div>
          </div>

          {/* Status & Style */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Post Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="style">Writing Style</Label>
              <Input
                id="style"
                value={formData.style}
                onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value }))}
                placeholder="e.g., Oskar, Mathias, Custom"
              />
            </div>
          </div>

          {/* Platforms */}
          <div className="space-y-2">
            <Label>Platforms</Label>
            <div className="flex flex-wrap gap-2">
              {availablePlatforms.map((platform) => (
                <div key={platform.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={platform.id}
                    checked={formData.platforms.includes(platform.id)}
                    onCheckedChange={() => togglePlatform(platform.id)}
                  />
                  <Label
                    htmlFor={platform.id}
                    className={`cursor-pointer px-2 py-1 rounded-md text-xs ${
                      formData.platforms.includes(platform.id) ? platform.color : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {platform.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="content">Post Content</Label>
              <div className="flex items-center gap-2">
                  <Checkbox
                    id="translation"
                    checked={showTranslation}
                    onCheckedChange={(checked) => setShowTranslation(checked === true)}
                />
                <Label htmlFor="translation" className="text-sm cursor-pointer flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  Add Translation
                </Label>
              </div>
            </div>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={6}
              placeholder="Write your post content..."
            />
          </div>

          {showTranslation && (
            <div className="space-y-2">
              <Label htmlFor="contentTranslation">Content Translation</Label>
              <Textarea
                id="contentTranslation"
                value={formData.contentTranslation}
                onChange={(e) => setFormData(prev => ({ ...prev, contentTranslation: e.target.value }))}
                rows={6}
                placeholder="Translated content..."
              />
            </div>
          )}

          {/* CTA */}
          <div className="space-y-2">
            <Label htmlFor="cta">Call to Action (Optional)</Label>
            <Textarea
              id="cta"
              value={formData.cta}
              onChange={(e) => setFormData(prev => ({ ...prev, cta: e.target.value }))}
              rows={2}
              placeholder="👉 What's your take on this? Share in comments..."
            />
          </div>

          {showTranslation && (
            <div className="space-y-2">
              <Label htmlFor="ctaTranslation">CTA Translation</Label>
              <Textarea
                id="ctaTranslation"
                value={formData.ctaTranslation}
                onChange={(e) => setFormData(prev => ({ ...prev, ctaTranslation: e.target.value }))}
                rows={2}
                placeholder="Translated CTA..."
              />
            </div>
          )}
        </div>

        <div className="flex justify-between pt-6 border-t">
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Post
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formData.title || !formData.content}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}