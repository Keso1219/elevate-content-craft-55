"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { callAgent } from "@/lib/api";
import type { AgentMode, ChatMessage } from "@/types/agent";

interface ComposerProps {
  currentMode: AgentMode;
  onMessage: (message: ChatMessage) => void;
  onUpdateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  onOptimisticArtifact: (type: "post" | "idea" | "email", data: any) => void;
  onRefreshArtifacts: () => void;
}

export default function Composer({ 
  currentMode, 
  onMessage, 
  onUpdateMessage, 
  onOptimisticArtifact,
  onRefreshArtifacts 
}: ComposerProps) {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [useSources, setUseSources] = useState(true);

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

  const getSuggestionChips = () => {
    switch (currentMode) {
      case "chat":
        return [
          "Help me brainstorm content ideas",
          "Review my recent posts",
          "What's trending in my industry?"
        ];
      case "post":
        return [
          "Write a LinkedIn thought leadership post",
          "Create 3 Twitter thread ideas",
          "Draft an announcement post"
        ];
      case "lead":
        return [
          "Brainstorm lead magnet ideas for SaaS founders",
          "Create post ideas about productivity",
          "Generate content around customer success"
        ];
      case "email":
        return [
          "Write a welcome email sequence",
          "Draft a nurture email",
          "Create a re-engagement email"
        ];
      default:
        return [];
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
      mode: currentMode
    };

    onMessage(userMessage);
    const currentInput = input;
    setInput("");
    setLoading(true);

    // Add loading message
    const loadingId = (Date.now() + 1).toString();
    const loadingMessage: ChatMessage = {
      id: loadingId,
      role: 'assistant',
      content: "...loading",
      timestamp: new Date().toISOString(),
      mode: currentMode
    };
    onMessage(loadingMessage);

    try {
      const response = await callAgent({
        mode: currentMode,
        input: currentInput,
        options: { 
          cite: useSources,
          platforms: ["LinkedIn"],
          style: "Default",
          type: currentMode === "lead" ? "other" : undefined
        }
      });

      // Update loading message with response
      onUpdateMessage(loadingId, {
        content: response.raw,
        sources: useSources ? ["Context used"] : undefined
      });

      // Handle automatic saves for non-chat modes
      if (currentMode !== "chat" && response.raw) {
        // Auto-save functionality can be added here if needed
      }

    } catch (error) {
      console.error("Error calling agent:", error);
      onUpdateMessage(loadingId, {
        content: "Sorry, I encountered an error. Please try again."
      });
      
      toast({
        title: "Error",
        description: "Failed to get response from AI assistant",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="border-t border-border p-4 space-y-3">
      {/* Suggestion chips */}
      {!input && getSuggestionChips().length > 0 && (
        <div className="flex flex-wrap gap-2">
          {getSuggestionChips().map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleSuggestionClick(suggestion)}
              className="text-xs h-7 px-3"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      )}

      {/* Source toggle */}
      <div className="flex items-center gap-2">
        <Checkbox
          checked={useSources}
          onCheckedChange={(checked) => setUseSources(checked as boolean)}
          id="use-sources"
        />
        <Label htmlFor="use-sources" className="text-sm">
          Use sources from Knowledge Vault & CRM
        </Label>
      </div>

      {/* Input area */}
      <div className="flex space-x-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={getPlaceholderText()}
          className="flex-1 resize-none min-h-[44px] max-h-32"
          rows={1}
          disabled={loading}
        />
        <Button 
          onClick={handleSend}
          disabled={!input.trim() || loading}
          size="lg"
          className="px-4"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}