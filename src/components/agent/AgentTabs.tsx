"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, 
  Sparkles, 
  User, 
  Bot, 
  Copy, 
  Calendar, 
  Save, 
  Download,
  MessageSquare,
  FileText,
  Magnet,
  Mail,
  Loader2
} from "lucide-react";
import { callAgent, savePostToLibrary, schedulePost, saveLeadMagnet, saveEmail } from "@/lib/api";
import type { ChatMessage, PostVariant, LeadMagnet, EmailVariant } from "@/types/agent";

type RawEmailVariant = string | { subject?: string; body?: string };

export default function AgentTabs() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("chat");

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm Elev8, your AI creation assistant. I can help you with chat questions, social posts, lead magnets, and emails. What would you like to create today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [useSources, setUseSources] = useState(true);

  // Posts state
  const [postSeed, setPostSeed] = useState("");
  const [postVariants, setPostVariants] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["LinkedIn"]);
  const [postStyle, setPostStyle] = useState("Oskar-style");
  const [postTone, setPostTone] = useState("Professional");
  const [postLength, setPostLength] = useState("medium");
  const [postLoading, setPostLoading] = useState(false);

  // Lead Magnets state
  const [leadType, setLeadType] = useState<"checklist" | "guide" | "calculator" | "mini-guide">("checklist");
  const [leadTopic, setLeadTopic] = useState("");
  const [leadAudience, setLeadAudience] = useState("");
  const [leadContent, setLeadContent] = useState("");
  const [leadHooks, setLeadHooks] = useState<string[]>([]);
  const [leadLoading, setLeadLoading] = useState(false);
  const [generateOutline, setGenerateOutline] = useState(false);

  // Email state
  const [emailType, setEmailType] = useState("Welcome");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailSegment, setEmailSegment] = useState("");
  const [emailVariants, setEmailVariants] = useState<EmailVariant[]>([]);
  const [emailVariantCount, setEmailVariantCount] = useState(3);
  const [emailLoading, setEmailLoading] = useState(false);

  // Chat functions
  const handleChatSend = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await callAgent({
        mode: "chat",
        input: chatInput,
        options: { cite: useSources }
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.raw,
        timestamp: new Date().toISOString(),
        sources: useSources ? ["Context used"] : undefined
      };

      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from AI assistant",
        variant: "destructive"
      });
    } finally {
      setChatLoading(false);
    }
  };

  const saveChatToLibrary = async (message: ChatMessage) => {
    try {
      await savePostToLibrary(message.content, ["LinkedIn"], "Generated from chat");
      toast({
        title: "Saved",
        description: "Message saved to your library as a draft post"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save to library",
        variant: "destructive"
      });
    }
  };

  // Posts functions
  const generatePosts = async () => {
    if (!postSeed.trim() || postLoading) return;

    setPostLoading(true);
    try {
      const response = await callAgent({
        mode: "post",
        input: postSeed,
        options: {
          platforms: selectedPlatforms,
          style: postStyle,
          tone: postTone,
          length: postLength
        }
      });

      const variants = Array.isArray(response.data) 
        ? response.data 
        : response.raw.split("\n\n").filter(Boolean);
      
      setPostVariants(variants.slice(0, 5));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate posts",
        variant: "destructive"
      });
    } finally {
      setPostLoading(false);
    }
  };

  const savePostVariant = async (content: string) => {
    try {
      await savePostToLibrary(content, selectedPlatforms, postStyle);
      toast({
        title: "Saved",
        description: "Post saved to your library"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save post",
        variant: "destructive"
      });
    }
  };

  // Lead Magnet functions
  const generateLeadMagnet = async () => {
    if (!leadTopic.trim() || leadLoading) return;

    setLeadLoading(true);
    try {
      const response = await callAgent({
        mode: "lead",
        input: leadTopic,
        options: {
          type: leadType,
          audience: leadAudience,
          outline: generateOutline,
          generateHooks: true
        }
      });

      setLeadContent(response.raw);
      
      // Try to extract hooks if generated
      const lines = response.raw.split('\n');
      const hookLines = lines.filter(line => 
        line.toLowerCase().includes('hook') && line.includes('•')
      );
      if (hookLines.length > 0) {
        setLeadHooks(hookLines.map(line => line.replace(/^.*?•\s*/, '')));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate lead magnet",
        variant: "destructive"
      });
    } finally {
      setLeadLoading(false);
    }
  };

  const saveLeadMagnetDraft = async () => {
    if (!leadContent.trim()) return;

    try {
      await saveLeadMagnet(leadTopic || "Untitled Lead Magnet", leadType, leadContent, leadHooks);
      toast({
        title: "Saved",
        description: "Lead magnet saved as draft"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save lead magnet",
        variant: "destructive"
      });
    }
  };

  // Email functions
  const generateEmails = async () => {
    if (!emailSubject.trim() || emailLoading) return;

    setEmailLoading(true);
    try {
      const response = await callAgent({
        mode: "email",
        input: emailSubject,
        options: {
          emailType,
          segmentId: emailSegment,
          variants: emailVariantCount
        }
      });

      let variants: RawEmailVariant[] = [];
      try {
        variants = Array.isArray(response.data) ? response.data : JSON.parse(response.raw);
      } catch {
        // Fallback parsing
        const lines = response.raw.split('\n\n');
        variants = [{
          subject: emailSubject,
          body: response.raw
        }];
      }

      const emailVars: EmailVariant[] = variants.map((v: RawEmailVariant, i: number) => ({
        id: (Date.now() + i).toString(),
        subject: (typeof v === 'string' ? undefined : v.subject) || emailSubject,
        body: (typeof v === 'string' ? v : v.body) || (typeof v === 'string' ? v : ''),
        emailType,
        segmentId: emailSegment
      }));

      setEmailVariants(emailVars);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate emails",
        variant: "destructive"
      });
    } finally {
      setEmailLoading(false);
    }
  };

  const saveEmailDraft = async (variant: EmailVariant) => {
    try {
      await saveEmail(variant.subject, variant.body, variant.emailType, variant.segmentId);
      toast({
        title: "Saved",
        description: "Email saved as draft"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save email",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Content copied to clipboard"
    });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="w-full max-w-7xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sparkles className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Creation Agent</h1>
              <p className="text-muted-foreground">AI-powered content creation across multiple formats</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="lead" className="flex items-center gap-2">
              <Magnet className="h-4 w-4" />
              Lead Magnets
            </TabsTrigger>
            <TabsTrigger value="emails" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Emails
            </TabsTrigger>
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-[60vh] flex flex-col">
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-start space-x-3 ${
                        msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <div className={`p-2 rounded-full ${
                        msg.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-accent text-accent-foreground'
                      }`}>
                        {msg.role === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      
                      <div className={`flex-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                        <div className={`inline-block p-3 rounded-lg max-w-md ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          {msg.sources && (
                            <div className="mt-2 pt-2 border-t border-border/50">
                              <Badge variant="outline" className="text-xs">
                                Sources used
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-muted-foreground">
                            {formatTime(msg.timestamp)}
                          </p>
                          {msg.role === 'assistant' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => saveChatToLibrary(msg)}
                              className="h-6 px-2 text-xs"
                            >
                              <Save className="h-3 w-3 mr-1" />
                              Save
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {chatLoading && (
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-full bg-accent text-accent-foreground">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4 border-t border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Checkbox
                      checked={useSources}
                      onCheckedChange={(checked) => setUseSources(checked as boolean)}
                      id="use-sources"
                    />
                    <Label htmlFor="use-sources" className="text-sm">
                      Use sources from Knowledge Vault
                    </Label>
                  </div>
                  <div className="flex space-x-2">
                    <Textarea
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleChatSend();
                        }
                      }}
                      placeholder="Ask me anything about content strategy, get help with ideas, or request specific content..."
                      className="flex-1 resize-none"
                      rows={2}
                    />
                    <Button 
                      onClick={handleChatSend}
                      disabled={!chatInput.trim() || chatLoading}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <Label>Content Seed / Prompt</Label>
                  <Textarea
                    value={postSeed}
                    onChange={(e) => setPostSeed(e.target.value)}
                    placeholder="Describe your idea, paste notes, or provide context for the posts..."
                    rows={4}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Style</Label>
                      <Select value={postStyle} onValueChange={setPostStyle}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Oskar-style">Oskar-style</SelectItem>
                          <SelectItem value="Mathias-style">Mathias-style</SelectItem>
                          <SelectItem value="Custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Tone</Label>
                      <Select value={postTone} onValueChange={setPostTone}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Professional">Professional</SelectItem>
                          <SelectItem value="Casual">Casual</SelectItem>
                          <SelectItem value="Bold">Bold</SelectItem>
                          <SelectItem value="Inspirational">Inspirational</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Length</Label>
                    <Select value={postLength} onValueChange={setPostLength}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="long">Long</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Platforms</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["LinkedIn", "X", "Instagram", "Facebook"].map((platform) => (
                        <Button
                          key={platform}
                          variant={selectedPlatforms.includes(platform) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setSelectedPlatforms(prev =>
                              prev.includes(platform)
                                ? prev.filter(p => p !== platform)
                                : [...prev, platform]
                            );
                          }}
                        >
                          {platform}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={generatePosts}
                disabled={!postSeed.trim() || postLoading}
                className="w-full"
              >
                {postLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Variations...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Variations
                  </>
                )}
              </Button>

              {postVariants.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                  {postVariants.map((variant, i) => (
                    <Card key={i} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">Variant {i + 1}</Badge>
                          <div className="flex gap-1">
                            {selectedPlatforms.map(platform => (
                              <Badge key={platform} variant="secondary" className="text-xs">
                                {platform}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <p className="text-sm whitespace-pre-wrap">{variant}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(variant)}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                          
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => savePostVariant(variant)}
                            >
                              <Save className="h-3 w-3 mr-1" />
                              Save
                            </Button>
                            <Button variant="outline" size="sm">
                              <Calendar className="h-3 w-3 mr-1" />
                              Schedule
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Lead Magnets Tab */}
          <TabsContent value="lead" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label>Asset Type</Label>
                    <Select value={leadType} onValueChange={(value: "checklist" | "guide" | "calculator" | "mini-guide") => setLeadType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checklist">Checklist</SelectItem>
                        <SelectItem value="guide">Guide</SelectItem>
                        <SelectItem value="calculator">Calculator</SelectItem>
                        <SelectItem value="mini-guide">Mini-guide</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Topic / Offer</Label>
                    <Input
                      value={leadTopic}
                      onChange={(e) => setLeadTopic(e.target.value)}
                      placeholder="e.g., 'LinkedIn Growth Checklist'"
                    />
                  </div>
                  
                  <div>
                    <Label>Target Audience (Optional)</Label>
                    <Input
                      value={leadAudience}
                      onChange={(e) => setLeadAudience(e.target.value)}
                      placeholder="e.g., 'B2B SaaS founders'"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={generateOutline}
                      onCheckedChange={(checked) => setGenerateOutline(checked as boolean)}
                      id="generate-outline"
                    />
                    <Label htmlFor="generate-outline">Generate outline first</Label>
                  </div>

                  <Button
                    onClick={generateLeadMagnet}
                    disabled={!leadTopic.trim() || leadLoading}
                    className="w-full"
                  >
                    {leadLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate {leadType}
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {leadHooks.length > 0 && (
                    <div>
                      <Label>Generated Hooks</Label>
                      <div className="space-y-2 mt-2">
                        {leadHooks.map((hook, i) => (
                          <div key={i} className="bg-muted/50 p-2 rounded text-sm">
                            {hook}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {leadContent && (
                <Card className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{leadTopic || `${leadType} Content`}</h3>
                      <Badge variant="outline">{leadType}</Badge>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg max-h-96 overflow-y-auto">
                      <pre className="text-sm whitespace-pre-wrap font-sans">{leadContent}</pre>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(leadContent)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          Export
                        </Button>
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={saveLeadMagnetDraft}
                      >
                        <Save className="h-3 w-3 mr-1" />
                        Save Draft
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>
          </TabsContent>

          {/* Emails Tab */}
          <TabsContent value="emails" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label>Email Type</Label>
                    <Select value={emailType} onValueChange={setEmailType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Welcome">Welcome</SelectItem>
                        <SelectItem value="Nurture">Nurture</SelectItem>
                        <SelectItem value="Re-engage">Re-engage</SelectItem>
                        <SelectItem value="Promotional">Promotional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Subject Idea</Label>
                    <Input
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="e.g., 'Welcome to our community'"
                    />
                  </div>
                  
                  <div>
                    <Label>Segment (Optional)</Label>
                    <Input
                      value={emailSegment}
                      onChange={(e) => setEmailSegment(e.target.value)}
                      placeholder="e.g., 'New subscribers'"
                    />
                  </div>
                  
                  <div>
                    <Label>Variant Count</Label>
                    <Select 
                      value={emailVariantCount.toString()} 
                      onValueChange={(value) => setEmailVariantCount(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={generateEmails}
                    disabled={!emailSubject.trim() || emailLoading}
                    className="w-full"
                  >
                    {emailLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Emails
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {emailVariants.length > 0 && (
                <div className="space-y-4">
                  {emailVariants.map((variant, i) => (
                    <Card key={variant.id} className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">Variant {i + 1}</Badge>
                          <Badge variant="secondary">{emailType}</Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-muted-foreground">SUBJECT</Label>
                            <div className="bg-muted/50 p-2 rounded text-sm font-medium">
                              {variant.subject}
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-xs text-muted-foreground">BODY</Label>
                            <div className="bg-muted/50 p-3 rounded text-sm max-h-48 overflow-y-auto">
                              <pre className="whitespace-pre-wrap font-sans">{variant.body}</pre>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(`${variant.subject}\n\n${variant.body}`)}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                          
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={() => saveEmailDraft(variant)}
                            >
                              <Save className="h-3 w-3 mr-1" />
                              Save Draft
                            </Button>
                            <Button variant="outline" size="sm">
                              Export
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
