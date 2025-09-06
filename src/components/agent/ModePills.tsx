"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageSquare, FileText, Magnet, Mail } from "lucide-react";
import type { AgentMode } from "@/types/agent";

interface ModePillsProps {
  currentMode: AgentMode;
  onModeChange: (mode: AgentMode) => void;
}

const modes = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "post", label: "Posts", icon: FileText },
  { id: "lead", label: "Lead Magnets", icon: Magnet },
  { id: "email", label: "Emails", icon: Mail },
] as const;

export default function ModePills({ currentMode, onModeChange }: ModePillsProps) {
  return (
    <div className="flex items-center gap-2 p-1 bg-muted rounded-lg w-fit">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = currentMode === mode.id;
        
        return (
          <motion.div key={mode.id} className="relative">
            <Button
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onModeChange(mode.id)}
              className={`
                relative z-10 flex items-center gap-2 text-sm font-medium transition-colors
                ${isActive 
                  ? "text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              <Icon className="h-4 w-4" />
              {mode.label}
            </Button>
            
            {isActive && (
              <motion.div
                layoutId="activeModePill"
                className="absolute inset-0 bg-primary rounded-md"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}