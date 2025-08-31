import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, MessageSquare, Calendar, BookOpen, Upload } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Knowledge Vault",
    description: "Secure document storage with AI vectorization",
    preview: "Upload PDFs, CSVs, and documents",
    href: "/upload"
  },
  {
    icon: MessageSquare,
    title: "Elev8 Agent",
    description: "AI chat assistant for content creation",
    preview: "\"Create a LinkedIn post about AI trends\"",
    href: "/elev8"
  },
  {
    icon: Calendar,
    title: "Content Calendar",
    description: "Schedule and manage your content pipeline",
    preview: "Visual calendar with post previews",
    href: "/calendar"
  },
  {
    icon: BookOpen,
    title: "Posts Library",
    description: "Search and reuse your best content",
    preview: "Saved posts with filters and tags",
    href: "/library"
  }
];

export const FeaturePreview = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {" "}Scale Your Content
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From knowledge management to content scheduling, ElevEight provides a complete toolkit for content creators.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group cursor-pointer"
                  style={{ boxShadow: 'var(--shadow-card)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-elegant)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                  }}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {feature.description}
                  </p>
                  <div className="text-xs text-primary/80 bg-primary/5 px-2 py-1 rounded">
                    {feature.preview}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg" className="btn-hero">
            Explore All Features
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};