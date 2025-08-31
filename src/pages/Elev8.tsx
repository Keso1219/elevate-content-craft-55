import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Send, Sparkles, User, Bot, Copy, Calendar, Share, Globe } from "lucide-react";
import { useLocation } from "react-router-dom";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface GeneratedPost {
  id: string;
  content: string;
  contentTranslation?: string;
  platform: string;
  style: string;
  timestamp: string;
  language: 'sv' | 'en';
  cta?: string;
  ctaTranslation?: string;
}

export default function Elev8() {
  const { toast } = useToast();
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'sv' | 'en'>('sv');
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
      content: "🚀 Upptäckte precis kraften i AI-driven innehållsskapande!\n\nEfter att ha analyserat 50+ toppkreatörer har jag lärt mig att äkthet slår perfektion varje gång. Din unika röst + smart automatisering = innehåll som faktiskt konverterar.\n\nVad tycker du om AI inom innehållsskapande? 👇",
      contentTranslation: "🚀 Just discovered the power of AI-driven content creation!\n\nAfter analyzing 50+ top creators, I've learned that authenticity beats perfection every time. Your unique voice + smart automation = content that actually converts.\n\nWhat's your take on AI in content creation? 👇",
      platform: 'LinkedIn',
      style: 'Oskar-style',
      timestamp: '2024-01-15T14:30:00Z',
      language: 'sv'
    },
    {
      id: '2',
      content: "Sluta posta slumpmässigt innehåll. Börja posta med syfte. 🎯\n\nHär är vad som förändrade allt för mig:\n• Dokumentera din expertis\n• Studera dina idoler\n• Låt AI koppla ihop pusselbitar\n\nResultat? Innehåll som känns äkta dig men presterar som deras.",
      contentTranslation: "Stop posting random content. Start posting with purpose. 🎯\n\nHere's what changed everything for me:\n• Document your expertise\n• Study your idols\n• Let AI connect the dots\n\nResult? Content that feels authentically you but performs like theirs.",
      platform: 'LinkedIn',
      style: 'Mathias-style',
      timestamp: '2024-01-15T13:15:00Z',
      language: 'sv'
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
        content: "Ditt personliga inlägg kommer att visas här baserat på samtalskontexten och din kunskapsbas.",
        contentTranslation: "Your personalized post will appear here based on the conversation context and your knowledge base.",
        platform: 'LinkedIn',
        style: 'Custom',
        timestamp: new Date().toISOString(),
        language: 'sv'
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

  const copyPost = (post: GeneratedPost) => {
    const content = selectedLanguage === 'sv' ? post.content : (post.contentTranslation || post.content);
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Post content has been copied to your clipboard.",
    });
  };

  // Handle loading post from library
  useEffect(() => {
    if (location.state?.loadPost) {
      const loadedPost = location.state.loadPost;
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `I've loaded the post "${loadedPost.title}" for you. Would you like me to modify it, create a variation, or use it as inspiration for something new?`,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      const newPost: GeneratedPost = {
        id: Date.now().toString(),
        content: loadedPost.content,
        contentTranslation: loadedPost.contentTranslation,
        platform: loadedPost.platforms[0] || 'LinkedIn',
        style: loadedPost.style,
        timestamp: new Date().toISOString(),
        language: 'sv',
        cta: loadedPost.cta,
        ctaTranslation: loadedPost.ctaTranslation
      };
      
      setGeneratedPosts(prev => [newPost, ...prev]);
    }
  }, [location.state]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const hasGeneratedPosts = generatedPosts.length > 0;

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <Sparkles className="h-8 w-8 text-primary mr-3" />
                Elev8 Agent
              </h1>
              <p className="text-muted-foreground">
                Chat with your AI content assistant to create personalized, high-quality posts.
              </p>
            </div>
            
            {hasGeneratedPosts && (
              <div className="flex items-center space-x-2">
                <Button
                  variant={selectedLanguage === 'sv' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedLanguage('sv')}
                >
                  🇸🇪 Svenska
                </Button>
                <Button
                  variant={selectedLanguage === 'en' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedLanguage('en')}
                >
                  🇬🇧 English
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className={`${hasGeneratedPosts ? 'grid lg:grid-cols-3 gap-8' : 'flex justify-center'}`}>
          {/* Chat Interface */}
          <div className={`${hasGeneratedPosts ? 'lg:col-span-2' : 'w-full max-w-4xl'} transition-all duration-300`}>
            <Card className="h-[70vh] flex flex-col"
                  style={{ boxShadow: 'var(--shadow-card)' }}>
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
          {hasGeneratedPosts && (
            <div className="space-y-6 animate-slide-in-right">
              <h2 className="text-xl font-semibold">Generated Posts</h2>
              
              {generatedPosts.map((post) => (
                <Card key={post.id} className="p-4 hover:shadow-lg transition-all duration-200"
                      style={{ boxShadow: 'var(--shadow-card)' }}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {post.platform}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {post.style}
                        </Badge>
                        {post.language && (
                          <Badge variant="outline" className="text-xs">
                            {post.language === 'sv' ? '🇸🇪' : '🇬🇧'}
                          </Badge>
                        )}
                      </div>
                      <span className="text-muted-foreground">
                        {formatTime(post.timestamp)}
                      </span>
                    </div>
                    
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm whitespace-pre-line">
                        {selectedLanguage === 'sv' ? post.content : (post.contentTranslation || post.content)}
                      </p>
                      {post.cta && (
                        <p className="text-sm mt-2 font-medium text-primary">
                          {selectedLanguage === 'sv' ? post.cta : (post.ctaTranslation || post.cta)}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyPost(post)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                      
                      <div className="flex items-center space-x-1">
                        <Button variant="outline" size="sm">
                          <Calendar className="h-3 w-3 mr-1" />
                          Schedule
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share className="h-3 w-3 mr-1" />
                          Share
                        </Button>
                        {post.contentTranslation && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedLanguage(selectedLanguage === 'sv' ? 'en' : 'sv')}
                          >
                            <Globe className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}