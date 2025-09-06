import { Sparkles } from "lucide-react";
import AgentWithModes from "@/components/agent/AgentWithModes";

export default function Elev8() {
  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center">
            <Sparkles className="h-8 w-8 text-primary mr-3" />
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Elev8 Creation Agent
              </h1>
              <p className="text-muted-foreground">
                AI-powered content creation across multiple formats - Chat, Posts, Lead Magnets, and Emails
              </p>
            </div>
          </div>
        </div>

        <AgentWithModes />
      </div>
    </div>
  );
}