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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, BookOpen, Sparkles, Globe, Save } from "lucide-react";
import { ScheduledPost } from "@/pages/Calendar";

interface AddPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  onSave: (post: Omit<ScheduledPost, 'id'>) => void;
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

// Mock library posts (simplified for selection)
const libraryPosts = [
  {
    id: "lib_1",
    title: "AI Pipeline Management",
    content: "AI i pipeline-hantering. Så här använder vi det: prognoser baserade på historiska data...",
    platforms: ["LinkedIn"],
    style: "Mathias"
  },
  {
    id: "lib_2",
    title: "Follow-up Strategies", 
    content: "För två år sedan hatade jag uppföljningsmejl. Det kändes stelt, repetitivt...",
    platforms: ["LinkedIn"],
    style: "Oskar"
  },
  {
    id: "lib_3",
    title: "Efficiency Mindset",
    content: "När jag började i sälj trodde jag att framgång handlade om att 'jobba hårdare'...",
    platforms: ["LinkedIn", "Facebook"],
    style: "Oskar"
  }
];

// Mock generated posts
const generatedPosts = [
  {
    id: "gen_1",
    title: "AI Content Creation",
    content: "🚀 Upptäckte precis kraften i AI-driven innehållsskapande! Efter att ha analyserat 50+ toppkreatörer...",
    platforms: ["LinkedIn"],
    style: "Oskar-style"
  },
  {
    id: "gen_2", 
    title: "Sales Automation",
    content: "Automation förändrar hur vi säljer. Här är tre sätt vi använder AI för att öka våra conversions...",
    platforms: ["LinkedIn"],
    style: "Mathias-style"
  }
];

export function AddPostModal({ isOpen, onClose, selectedDate, onSave }: AddPostModalProps) {
  const [activeTab, setActiveTab] = useState("new");
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    contentTranslation: '',
    platforms: ['LinkedIn'] as string[],
    style: 'Oskar',
    language: 'sv' as 'sv' | 'en',
    status: 'scheduled' as 'scheduled' | 'draft' | 'reshare',
    scheduledTime: '09:00',
    cta: '',
    ctaTranslation: ''
  });

  const [showTranslation, setShowTranslation] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        content: '',
        contentTranslation: '',
        platforms: ['LinkedIn'],
        style: 'Oskar',
        language: 'sv',
        status: 'scheduled',
        scheduledTime: '09:00',
        cta: '',
        ctaTranslation: ''
      });
      setShowTranslation(false);
      setActiveTab("new");
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!formData.title || !formData.content) return;

    const newPost: Omit<ScheduledPost, 'id'> = {
      title: formData.title,
      content: formData.content,
      contentTranslation: showTranslation ? formData.contentTranslation : undefined,
      platforms: formData.platforms,
      style: formData.style,
      language: formData.language,
      status: formData.status,
      scheduledDate: selectedDate,
      scheduledTime: formData.scheduledTime,
      cta: formData.cta,
      ctaTranslation: showTranslation ? formData.ctaTranslation : undefined
    };

    onSave(newPost);
    onClose();
  };

  const togglePlatform = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  type SimplePost = {
    id: string;
    title: string;
    content: string;
    platforms: string[];
    style: string;
  };

  const selectFromLibrary = (post: SimplePost) => {
    setFormData(prev => ({
      ...prev,
      title: post.title,
      content: post.content,
      platforms: post.platforms,
      style: post.style
    }));
    setActiveTab("new");
  };

  const selectFromGenerated = (post: SimplePost) => {
    setFormData(prev => ({
      ...prev,
      title: post.title,
      content: post.content,
      platforms: post.platforms,
      style: post.style
    }));
    setActiveTab("new");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Post
          </DialogTitle>
          <DialogDescription>
            Schedule a new post for {selectedDate ? formatDate(selectedDate) : 'the selected date'}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="new" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Post
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              From Library
            </TabsTrigger>
            <TabsTrigger value="generated" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Generated
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="space-y-4">
            {/* New Post Form */}
            <div className="space-y-4">
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

              {/* Time & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time">Scheduled Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Post Status</Label>
                  <Select value={formData.status} onValueChange={(value: 'scheduled' | 'draft' | 'reshare') => setFormData(prev => ({ ...prev, status: value }))}>
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
              </div>

              {/* Style */}
              <div className="space-y-2">
                <Label htmlFor="style">Writing Style</Label>
                <Input
                  id="style"
                  value={formData.style}
                  onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value }))}
                  placeholder="e.g., Oskar, Mathias, Custom"
                />
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
                  rows={8}
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
                    rows={8}
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
          </TabsContent>

          <TabsContent value="library" className="space-y-4">
            <div className="grid gap-3 max-h-[400px] overflow-y-auto">
              {libraryPosts.map((post) => (
                <Card key={post.id} className="p-4 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => selectFromLibrary(post)}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-sm">{post.title}</h3>
                    <Badge variant="secondary" className="text-xs">{post.style}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.content}</p>
                  <div className="flex gap-1">
                    {post.platforms.map((platform) => (
                      <Badge key={platform} variant="outline" className="text-xs">{platform}</Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="generated" className="space-y-4">
            <div className="grid gap-3 max-h-[400px] overflow-y-auto">
              {generatedPosts.map((post) => (
                <Card key={post.id} className="p-4 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => selectFromGenerated(post)}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-sm">{post.title}</h3>
                    <Badge variant="secondary" className="text-xs">{post.style}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.content}</p>
                  <div className="flex gap-1">
                    {post.platforms.map((platform) => (
                      <Badge key={platform} variant="outline" className="text-xs">{platform}</Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!formData.title || !formData.content}
          >
            <Save className="w-4 h-4 mr-2" />
            Schedule Post
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
