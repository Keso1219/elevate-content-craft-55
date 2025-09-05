import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, Copy, Edit3, Trash2, Eye, MessageSquare, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Post {
  id: string;
  language: 'sv' | 'en';
  title: string;
  titleTranslation?: string;
  style: string;
  theme: string;
  platforms: string[];
  content: string;
  contentTranslation?: string;
  cta: string;
  ctaTranslation?: string;
  date: string;
}

const mockPosts: Post[] = [
  {
    id: "post_mathias_01",
    language: "sv",
    title: "Leadpersonaliserade mejl",
    titleTranslation: "Personalized Lead Emails",
    style: "Mathias",
    theme: "Personalized Outreach",
    platforms: ["LinkedIn"],
    content: "Såhär använder vi AI för att skriva personliga outreach-mejl i skala.\n\nTraditionellt:\n- Copy/paste av samma mall\n- \"Hej [förnamn]\" och hoppas på det bästa\n\nMed AI kan vi:\n- Analysera prospektens offentliga innehåll\n- Generera unika öppningsrader för varje mottagare\n- Testa hundratals varianter och optimera svarsfrekvens\n\nResultat:\n3x högre öppningsgrad\nDubbel svarsfrekvens\n\nAI gör det som tidigare tog timmar på sekunder.",
    contentTranslation: "Here's how we use AI to write personalized outreach emails at scale.\n\nTraditionally:\n- Copy/paste the same template\n- \"Hi [first name]\" and hope for the best\n\nWith AI we can:\n- Analyze prospects' public content\n- Generate unique opening lines for each recipient\n- Test hundreds of variants and optimize response rates\n\nResults:\n3x higher open rates\nDouble response rates\n\nAI does what used to take hours in seconds.",
    cta: "👉 Hur personaliserar du din outreach idag? Kommentera gärna så jämför vi metoder.",
    ctaTranslation: "👉 How do you personalize your outreach today? Feel free to comment so we can compare methods.",
    date: "2025-08-10"
  },
  {
    id: "post_oskar_01",
    language: "sv",
    title: "Uppföljningar",
    titleTranslation: "Follow-ups",
    style: "Oskar",
    theme: "Follow-ups",
    platforms: ["LinkedIn"],
    content: "För två år sedan hatade jag uppföljningsmejl.\nDet kändes stelt, repetitivt och ofta meningslöst.\n\nIdag skriver jag knappt några själv.\nAI gör det åt mig.\n\nDen analyserar kundens tidigare svar, deras bransch och till och med tonläge.\nSedan formulerar den en uppföljning som känns som om jag skrev den själv.\n\nSkillnaden?\nMina uppföljningar blir lästa – och uppskattade.",
    contentTranslation: "Two years ago, I hated follow-up emails.\nThey felt stiff, repetitive, and often meaningless.\n\nToday I barely write any myself.\nAI does it for me.\n\nIt analyzes the customer's previous responses, their industry, and even tone of voice.\nThen it formulates a follow-up that feels like I wrote it myself.\n\nThe difference?\nMy follow-ups get read – and appreciated.",
    cta: "👉 Är uppföljningar något du tycker är jobbigt eller naturligt? Låt oss diskutera i kommentarerna.",
    ctaTranslation: "👉 Are follow-ups something you find tedious or natural? Let's discuss in the comments.",
    date: "2025-08-09"
  },
  {
    id: "post_mathias_02",
    language: "sv",
    title: "Pipeline-hantering",
    titleTranslation: "Pipeline Management",
    style: "Mathias",
    theme: "Sales Automation",
    platforms: ["LinkedIn"],
    content: "AI i pipeline-hantering.\n\nSå här använder vi det:\n- Prognoser baserade på historiska data\n- Automatisk riskflagga för deals som ser ut att fastna\n- Realtidsrekommendationer för nästa steg\n\nTidigare gick timmar åt till manuella Excel-blad.\nNu får vi bättre precision – på minuter.\n\nResultat:\n- Mer träffsäkra prognoser\n- Kortare säljcykler",
    contentTranslation: "AI in pipeline management.\n\nHere's how we use it:\n- Forecasts based on historical data\n- Automatic risk flags for deals that seem stuck\n- Real-time recommendations for next steps\n\nPreviously, hours went to manual Excel sheets.\nNow we get better precision – in minutes.\n\nResults:\n- More accurate forecasts\n- Shorter sales cycles",
    cta: "👉 Tror du AI kan prognostisera bättre än en erfaren säljchef, eller behövs alltid den mänskliga känslan? Kommentera vad du tror.",
    ctaTranslation: "👉 Do you think AI can forecast better than an experienced sales manager, or is the human touch always needed? Comment what you think.",
    date: "2025-08-08"
  },
  {
    id: "post_oskar_02",
    language: "sv",
    title: "Effektivitet",
    titleTranslation: "Efficiency",
    style: "Oskar",
    theme: "Work Smart",
    platforms: ["LinkedIn"],
    content: "När jag började i sälj trodde jag att framgång handlade om att \"jobba hårdare\".\nFler samtal. Fler mejl. Fler timmar.\n\nMen sanningen är att jag brände ut mig.\n\nAI förändrade min syn på effektivitet.\nNu är det inte \"fler\" som gäller.\nDet är \"rätt\".\n\n- Rätt kontakt.\n- Rätt budskap.\n- Rätt tidpunkt.\n\nOch ironin?\nNär jag slutade jaga volym – och lät AI hjälpa mig prioritera – bokade jag fler möten än någonsin.",
    contentTranslation: "When I started in sales, I thought success was about \"working harder\".\nMore calls. More emails. More hours.\n\nBut the truth is I burned myself out.\n\nAI changed my view on efficiency.\nNow it's not \"more\" that matters.\nIt's \"right\".\n\n- Right contact.\n- Right message.\n- Right timing.\n\nAnd the irony?\nWhen I stopped chasing volume – and let AI help me prioritize – I booked more meetings than ever.",
    cta: "👉 Har AI hjälpt dig att jobba smartare istället för hårdare? Dela gärna en egen erfarenhet i kommentarerna.",
    ctaTranslation: "👉 Has AI helped you work smarter instead of harder? Feel free to share your own experience in the comments.",
    date: "2025-08-07"
  }
];

export default function Library() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<'sv' | 'en'>('sv');
  const [posts] = useState<Post[]>(mockPosts);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.theme.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin': return 'bg-blue-100 text-blue-800';
      case 'facebook': return 'bg-gray-100 text-gray-800';
      case 'instagram': return 'bg-pink-100 text-pink-800';
      case 'reddit': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const copyPost = (post: Post) => {
    const content = selectedLanguage === 'sv' ? post.content : (post.contentTranslation || post.content);
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Post content has been copied to your clipboard.",
    });
  };

  const openInChat = (post: Post) => {
    toast({
      title: "Opening in Elev8",
      description: "Post will be loaded into the chat interface.",
    });
    navigate('/elev8', { state: { loadPost: post } });
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Posts Library</h1>
          <p className="text-muted-foreground mb-6">
            Browse saved content, reuse old posts, and feed Elev8 with past insights.
          </p>
          
          {/* Search and Language Toggle */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts, themes, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
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
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="p-6 hover:shadow-lg transition-all duration-200 animate-fade-in">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">
                      {selectedLanguage === 'sv' ? post.title : (post.titleTranslation || post.title)}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {post.style}-style
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {post.theme}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {post.platforms.map((platform) => (
                      <Badge key={platform} className={`text-xs ${getPlatformColor(platform)}`}>
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Content Preview */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground line-clamp-4">
                    {selectedLanguage === 'sv' ? post.content : (post.contentTranslation || post.content)}
                  </p>
                </div>

                {/* Date */}
                <p className="text-xs text-muted-foreground">
                  Saved: {new Date(post.date).toLocaleDateString()}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => openInChat(post)}
                    className="flex items-center space-x-1"
                  >
                    <MessageSquare className="h-3 w-3" />
                    <span>Use in Chat</span>
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyPost(post)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
