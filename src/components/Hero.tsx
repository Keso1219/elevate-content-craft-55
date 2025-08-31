import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, Search, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

export const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-secondary via-background to-muted min-h-[80vh] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Upload your docs.
                <br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Scrape your idols.
                </span>
                <br />
                Elevate your content.
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl">
                AI-powered social media assistant for founders, creators, and marketers. 
                Generate personalized, high-quality content using your own knowledge and inspiration.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="btn-hero">
                Start Creating
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                Watch Demo
              </Button>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Live & Ready</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>AI-Powered</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src={heroImage} 
              alt="ElevEight AI content creation platform dashboard"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg">
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};