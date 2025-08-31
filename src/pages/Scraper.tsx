import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, Play, RefreshCw, CheckCircle, AlertCircle, Clock, Facebook, Linkedin, Instagram } from "lucide-react";

interface ScrapingJob {
  id: string;
  platform: string;
  identifier: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  lastUpdated: string;
  results?: number;
}

export default function Scraper() {
  const { toast } = useToast();
  const [platform, setPlatform] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState<ScrapingJob[]>([
    {
      id: '1',
      platform: 'LinkedIn',
      identifier: '@mathias.hedlund',
      status: 'completed',
      lastUpdated: '2025-08-10T14:30:00Z',
      results: 47
    },
    {
      id: '2',
      platform: 'Reddit',
      identifier: 'r/entrepreneur',
      status: 'completed',
      lastUpdated: '2025-08-10T13:15:00Z',
      results: 123
    },
    {
      id: '3',
      platform: 'LinkedIn',
      identifier: '@oskar.lindberg',
      status: 'running',
      lastUpdated: '2025-08-10T15:00:00Z'
    }
  ]);

  const handleStartScraping = async () => {
    if (!platform || !identifier) {
      toast({
        title: "Missing information",
        description: "Please select a platform and enter an identifier.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Create new job
    const newJob: ScrapingJob = {
      id: Date.now().toString(),
      platform,
      identifier,
      status: 'pending',
      lastUpdated: new Date().toISOString()
    };

    setJobs(prev => [newJob, ...prev]);

    try {
      // Simulate API call to webhook
      const response = await fetch('https://hooks.eleveight.se/scraper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform,
          identifier,
          userId: 'user_123' // In real app, get from auth
        })
      });

      if (response.ok) {
        // Update job status to running
        setJobs(prev => prev.map(job => 
          job.id === newJob.id 
            ? { ...job, status: 'running' as const }
            : job
        ));

        toast({
          title: "Scraping started",
          description: `Started scraping ${platform} for ${identifier}`,
        });

        // Simulate completion after delay
        setTimeout(() => {
          setJobs(prev => prev.map(job => 
            job.id === newJob.id 
              ? { 
                  ...job, 
                  status: 'completed' as const, 
                  results: Math.floor(Math.random() * 100) + 20,
                  lastUpdated: new Date().toISOString()
                }
              : job
          ));
        }, 5000);
      } else {
        throw new Error('Failed to start scraping');
      }
    } catch (error) {
      // Update job status to error
      setJobs(prev => prev.map(job => 
        job.id === newJob.id 
          ? { ...job, status: 'error' as const }
          : job
      ));

      toast({
        title: "Scraping failed",
        description: "Failed to start scraping. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setPlatform("");
      setIdentifier("");
    }
  };

  const getStatusIcon = (status: ScrapingJob['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: ScrapingJob['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return <Linkedin className="h-4 w-4 text-blue-600" />;
      case 'facebook':
        return <Facebook className="h-4 w-4 text-blue-700" />;
      case 'instagram':
        return <Instagram className="h-4 w-4 text-pink-600" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Scraper Setup</h1>
          <p className="text-muted-foreground">
            Scrape content from your favorite creators and platforms to inspire Elev8's content generation.
          </p>
        </div>

        {/* Scraper Form */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Start New Scraping Job</h2>
          
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Platform</label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LinkedIn">
                    <div className="flex items-center space-x-2">
                      <Linkedin className="h-4 w-4 text-blue-600" />
                      <span>LinkedIn</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Facebook">
                    <div className="flex items-center space-x-2">
                      <Facebook className="h-4 w-4 text-blue-700" />
                      <span>Facebook</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Instagram">
                    <div className="flex items-center space-x-2">
                      <Instagram className="h-4 w-4 text-pink-600" />
                      <span>Instagram</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Reddit">
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 bg-orange-500 rounded-full"></div>
                      <span>Reddit</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {platform === 'Reddit' ? 'Subreddit' : 'Username / Profile URL'}
              </label>
              <Input
                placeholder={
                  platform === 'Reddit' 
                    ? 'r/entrepreneur' 
                    : platform === 'LinkedIn'
                    ? '@username or linkedin.com/in/username'
                    : '@username or profile URL'
                }
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
          </div>

          <Button 
            onClick={handleStartScraping}
            disabled={isLoading || !platform || !identifier}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Starting Scraping...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Scraping
              </>
            )}
          </Button>
        </Card>

        {/* Scraping Jobs History */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Scraping History</h2>
          
          {jobs.map((job) => (
            <Card key={job.id} className="p-4 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getPlatformIcon(job.platform)}
                    <span className="font-medium">{job.platform}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">{job.identifier}</span>
                    {job.results && (
                      <Badge variant="outline" className="text-xs">
                        {job.results} posts
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(job.status)}
                    <Badge className={`text-xs ${getStatusColor(job.status)}`}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    {formatTime(job.lastUpdated)}
                  </div>

                  <div className="flex space-x-1">
                    {job.status === 'error' && (
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    )}
                    {job.status === 'completed' && (
                      <Button variant="outline" size="sm">
                        View Results
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {jobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No scraping jobs yet. Start your first one above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}