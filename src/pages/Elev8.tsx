import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Send, Sparkles, User, Bot, Copy, Calendar, Share } from "lucide-react";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface GeneratedPost {
  id: string;
  content: string;
  platform: string;
  style: string;
  timestamp: string;
}

export default function Elev8() {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm Elev8, your AI content assistant. I can help you create personalized posts using your uploaded documents and scraped inspiration. What would you like to create today?",
      timestamp: new Date().toISOString()
    }
  ]);
  
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([
    {
      id: '1',
      content: "🚀 Just discovered the power of AI-driven content creation! \n\nAfter analyzing 50+ top creators, I've learned that authenticity beats perfection every time. Your unique voice + smart automation = content that actually converts.\n\nWhat's your take on AI in content creation? 👇",
      platform: 'LinkedIn',
      style: 'Oskar-style',
      timestamp: '2024-01-15T14:30:00Z'
    },
    {
      id: '2',
      content: "Stop posting random content. Start posting with purpose. 🎯\n\nHere's what changed everything for me:\n• Document your expertise\n• Study your idols\n• Let AI connect the dots\n\nResult? Content that feels authentically you but performs like theirs.",
      platform: 'Twitter',
      style: 'Mathias-style',
      timestamp: '2024-01-15T13:15:00Z'
    }
  ]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I'll create a LinkedIn post inspired by your uploaded brand guidelines and the style of top creators in your industry. Here's what I'm thinking...",
        "Based on your documents about AI trends and the engagement patterns I've analyzed, here's a powerful post idea:",
        "Let me combine your expertise with proven content strategies from the creators you're following...",
        "I'll craft something that feels authentically you while leveraging the storytelling techniques that drive engagement:"
      ];
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
      
      // Generate a new post
      const newPost: GeneratedPost = {
        id: Date.now().toString(),
        content: "Your personalized post will appear here based on the conversation context and your knowledge base.",
        platform: 'LinkedIn',
        style: 'Custom',
        timestamp: new Date().toISOString()
      };
      
      setGeneratedPosts(prev => [newPost, ...prev]);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyPost = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Post content has been copied to your clipboard.",
    });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Sparkles className="h-8 w-8 text-primary mr-3" />
            Elev8 Agent
          </h1>
          <p className="text-muted-foreground">
            Chat with your AI content assistant to create personalized, high-quality posts.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[70vh] flex flex-col">
              {/* Messages */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.map((msg) => (
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
                      <div className={`inline-block p-3 rounded-lg max-w-xs sm:max-w-md ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-full bg-accent text-accent-foreground">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Input */}
              <div className="p-6 border-t border-border">
                <div className="flex space-x-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask Elev8 to create content, compare styles, or generate ideas..."
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isLoading}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Generated Posts */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Generated Posts</h2>
            
            {generatedPosts.map((post) => (
              <Card key={post.id} className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                        {post.platform}
                      </span>
                      <span className="px-2 py-1 bg-accent/10 text-accent rounded text-xs">
                        {post.style}
                      </span>
                    </div>
                    <span className="text-muted-foreground">
                      {formatTime(post.timestamp)}
                    </span>
                  </div>
                  
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm whitespace-pre-line">{post.content}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyPost(post.content)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="h-3 w-3 mr-1" />
                      Schedule
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}