"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ModePills from "./ModePills";
import MessageList from "./MessageList";
import Composer from "./Composer";
import ArtifactsDock from "./ArtifactsDock";
import type { AgentMode, ChatMessage, PostRow, LeadMagnetIdeaRow, EmailRow } from "@/types/agent";

export default function AgentWithModes() {
  const { toast } = useToast();
  const [currentMode, setCurrentMode] = useState<AgentMode>("chat");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm Elev8, your AI creation assistant. I can help you with chat questions, social posts, lead magnets, and emails. What would you like to create today?",
      timestamp: new Date().toISOString(),
      mode: "chat"
    }
  ]);
  
  // Artifacts state
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [ideas, setIdeas] = useState<LeadMagnetIdeaRow[]>([]);
  const [emails, setEmails] = useState<EmailRow[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load artifacts on mount and when refreshTrigger changes
  useEffect(() => {
    loadAllArtifacts();
  }, [refreshTrigger]);

  const loadAllArtifacts = async () => {
    try {
      const [postsRes, ideasRes, emailsRes] = await Promise.all([
        supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("lead_magnet_ideas").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("emails").select("*").order("created_at", { ascending: false }).limit(50)
      ]);

      if (postsRes.data) setPosts(postsRes.data as PostRow[]);
      if (ideasRes.data) setIdeas(ideasRes.data as LeadMagnetIdeaRow[]);
      if (emailsRes.data) setEmails(emailsRes.data as EmailRow[]);
    } catch (error) {
      console.error("Error loading artifacts:", error);
    }
  };

  const refreshArtifacts = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const updateMessage = (id: string, updates: Partial<ChatMessage>) => {
    setMessages(prev =>
      prev.map(msg => msg.id === id ? { ...msg, ...updates } : msg)
    );
  };

  // Add optimistic artifact update
  const addOptimisticArtifact = (type: "post" | "idea" | "email", data: any) => {
    const optimisticItem = {
      ...data,
      id: `temp_${Date.now()}`,
      created_at: new Date().toISOString(),
      saving: true
    };

    if (type === "post") {
      setPosts(prev => [optimisticItem, ...prev]);
    } else if (type === "idea") {
      setIdeas(prev => [optimisticItem, ...prev]);
    } else if (type === "email") {
      setEmails(prev => [optimisticItem, ...prev]);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] w-full">
      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_360px] gap-6 h-full">
        {/* Left: Chat */}
        <div className="flex flex-col space-y-4 min-h-0">
          <ModePills currentMode={currentMode} onModeChange={setCurrentMode} />
          <div className="flex-1 flex flex-col min-h-0">
            <MessageList 
              messages={messages} 
              currentMode={currentMode}
              onRefreshArtifacts={refreshArtifacts}
            />
            <Composer
              currentMode={currentMode}
              onMessage={addMessage}
              onUpdateMessage={updateMessage}
              onOptimisticArtifact={addOptimisticArtifact}
              onRefreshArtifacts={refreshArtifacts}
            />
          </div>
        </div>

        {/* Right: Artifacts Dock */}
        <div className="border-l border-border pl-6">
          <ArtifactsDock
            posts={posts}
            ideas={ideas}
            emails={emails}
            onRefresh={refreshArtifacts}
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden h-full flex flex-col">
        <div className="flex-1 flex flex-col space-y-4 min-h-0">
          <ModePills currentMode={currentMode} onModeChange={setCurrentMode} />
          <div className="flex-1 flex flex-col min-h-0">
            <MessageList 
              messages={messages} 
              currentMode={currentMode}
              onRefreshArtifacts={refreshArtifacts}
            />
            <Composer
              currentMode={currentMode}
              onMessage={addMessage}
              onUpdateMessage={updateMessage}
              onOptimisticArtifact={addOptimisticArtifact}
              onRefreshArtifacts={refreshArtifacts}
            />
          </div>
        </div>

        {/* Mobile Artifacts Drawer */}
        <div className="fixed bottom-4 right-4 z-50">
          <Drawer>
            <DrawerTrigger asChild>
              <Button size="lg" className="rounded-full shadow-lg">
                <Archive className="h-5 w-5 mr-2" />
                Artifacts
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[80vh]">
              <div className="p-4">
                <ArtifactsDock
                  posts={posts}
                  ideas={ideas}
                  emails={emails}
                  onRefresh={refreshArtifacts}
                />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
}