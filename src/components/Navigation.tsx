import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Brain, Search, MessageSquare, Calendar, BookOpen, Database } from "lucide-react";

export const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/vault', label: 'Knowledge Vault', icon: Database },
    { path: '/scraper', label: 'Scraper', icon: Search },
    { path: '/elev8', label: 'Elev8 Agent', icon: MessageSquare },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
    { path: '/library', label: 'Library', icon: BookOpen },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ElevEight
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === path
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{label}</span>
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm" className="btn-hero">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};