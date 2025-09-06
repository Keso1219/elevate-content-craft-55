"use client";
import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  User, 
  Bot, 
  Copy, 
  Save, 
  Edit,
  Calendar,
  Download,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { savePostToLibrary, saveLeadMagnet, saveEmail } from "@/lib/api";
import type { ChatMessage, AgentMode } from "@/types/agent";

interface MessageListProps {
  messages: ChatMessage[];
  currentMode: AgentMode;
  onRefreshArtifacts: () => void;
}

export default function MessageList({ messages, currentMode, onRefreshArtifacts }: MessageListProps) {
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Content copied to clipboard"
    });
  };

  const saveAsPost = async (content: string) => {
    try {
      await savePostToLibrary(content, ["LinkedIn"], "Generated from chat");
      onRefreshArtifacts();
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

  const saveAsIdea = async (content: string) => {
    try {
      // Extract title from content (first line or first 50 chars)
      const title = content.split('\n')[0].slice(0, 50) + (content.length > 50 ? '...' : '');
      await saveLeadMagnet(title, "other", content, []);
      onRefreshArtifacts();
      toast({
        title: "Saved",
        description: "Saved as lead magnet idea"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save idea",
        variant: "destructive"
      });
    }
  };

  const saveAsEmail = async (content: string) => {
    try {
      const lines = content.split('\n');
      const subject = lines[0] || "Generated Email";
      const body = lines.slice(1).join('\n') || content;
      
      await saveEmail(subject, body, "Generated", null);
      onRefreshArtifacts();
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

  const getPlaceholderText = () => {
    switch (currentMode) {
      case "chat":
        return "Ask me anything about content strategy, get help with ideas, or request specific content...";
      case "post":
        return "Describe the social post you want to create...";
      case "lead":
        return "Describe the lead magnet idea you want to brainstorm...";
      case "email":
        return "Describe the email you want to create...";
      default:
        return "Type your message...";
    }
  };

  return (
    <Card className="flex-1 flex flex-col min-h-0">
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-4 min-h-0"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start space-x-3 ${
                msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`p-2 rounded-full shrink-0 ${
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
              
              <div className={`flex-1 max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  
                  {/* Mode badge for assistant messages */}
                  {msg.role === 'assistant' && msg.mode && msg.mode !== 'chat' && (
                    <div className="mt-2 pt-2 border-t border-border/50">
                      <Badge variant="outline" className="text-xs capitalize">
                        {msg.mode}
                      </Badge>
                    </div>
                  )}
                  
                  {msg.sources && (
                    <div className="mt-2 pt-2 border-t border-border/50">
                      <Badge variant="outline" className="text-xs">
                        Sources used
                      </Badge>
                    </div>
                  )}
                </div>
                
                {/* Action buttons */}
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-muted-foreground">
                    {formatTime(msg.timestamp)}
                  </p>
                  
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(msg.content)}
                        className="h-6 px-2 text-xs opacity-60 hover:opacity-100"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      
                      {currentMode === 'post' || currentMode === 'chat' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => saveAsPost(msg.content)}
                          className="h-6 px-2 text-xs opacity-60 hover:opacity-100"
                        >
                          <Save className="h-3 w-3 mr-1" />
                          Save as Post
                        </Button>
                      ) : null}
                      
                      {currentMode === 'lead' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => saveAsIdea(msg.content)}
                          className="h-6 px-2 text-xs opacity-60 hover:opacity-100"
                        >
                          <Save className="h-3 w-3 mr-1" />
                          Save Idea
                        </Button>
                      )}
                      
                      {currentMode === 'email' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => saveAsEmail(msg.content)}
                          className="h-6 px-2 text-xs opacity-60 hover:opacity-100"
                        >
                          <Save className="h-3 w-3 mr-1" />
                          Save Email
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Loading indicator */}
          {messages.some(m => m.content === "...loading") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start space-x-3"
            >
              <div className="p-2 rounded-full bg-accent text-accent-foreground">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}