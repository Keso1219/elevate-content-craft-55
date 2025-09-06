"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Lightbulb, 
  Mail, 
  Plus,
  RefreshCw,
  Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ArtifactItemCard from "./ArtifactItemCard";
import ArtifactEditorSheet from "./ArtifactEditorSheet";
import type { PostRow, LeadMagnetIdeaRow, EmailRow } from "@/types/agent";

interface ArtifactsDockProps {
  posts: PostRow[];
  ideas: LeadMagnetIdeaRow[];
  emails: EmailRow[];
  onRefresh: () => void;
}

export default function ArtifactsDock({ posts, ideas, emails, onRefresh }: ArtifactsDockProps) {
  const [activeTab, setActiveTab] = useState("posts");
  const [editingItem, setEditingItem] = useState<{
    type: "post" | "idea" | "email";
    item: PostRow | LeadMagnetIdeaRow | EmailRow;
  } | null>(null);

  const handleEdit = (type: "post" | "idea" | "email", item: PostRow | LeadMagnetIdeaRow | EmailRow) => {
    setEditingItem({ type, item });
  };

  const handleCloseEditor = () => {
    setEditingItem(null);
    onRefresh(); // Refresh artifacts after editing
  };

  const getPostsForIdea = (ideaId: string) => {
    return posts.filter(post => post.origin_idea_id === ideaId);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Artifacts</h2>
        <Button variant="ghost" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts" className="flex items-center gap-2 text-xs">
            <FileText className="h-3 w-3" />
            Posts
            {posts.length > 0 && (
              <Badge variant="secondary" className="h-4 px-1 text-xs">
                {posts.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="ideas" className="flex items-center gap-2 text-xs">
            <Lightbulb className="h-3 w-3" />
            Ideas
            {ideas.length > 0 && (
              <Badge variant="secondary" className="h-4 px-1 text-xs">
                {ideas.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="emails" className="flex items-center gap-2 text-xs">
            <Mail className="h-3 w-3" />
            Emails
            {emails.length > 0 && (
              <Badge variant="secondary" className="h-4 px-1 text-xs">
                {emails.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 mt-4">
          {/* Posts Tab */}
          <TabsContent value="posts" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="space-y-2 pr-2">
                <AnimatePresence mode="popLayout">
                  {posts.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 text-muted-foreground"
                    >
                      <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No posts yet</p>
                      <p className="text-xs">Generate posts to see them here</p>
                    </motion.div>
                  ) : (
                    posts.map((post) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArtifactItemCard
                          type="post"
                          item={post}
                          onEdit={() => handleEdit("post", post)}
                          onRefresh={onRefresh}
                        />
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Ideas Tab */}
          <TabsContent value="ideas" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="space-y-2 pr-2">
                <AnimatePresence mode="popLayout">
                  {ideas.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 text-muted-foreground"
                    >
                      <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No ideas yet</p>
                      <p className="text-xs">Brainstorm ideas to see them here</p>
                    </motion.div>
                  ) : (
                    ideas.map((idea) => {
                      const relatedPosts = getPostsForIdea(idea.id);
                      return (
                        <motion.div
                          key={idea.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArtifactItemCard
                            type="idea"
                            item={idea}
                            relatedPosts={relatedPosts}
                            onEdit={() => handleEdit("idea", idea)}
                            onRefresh={onRefresh}
                          />
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Emails Tab */}
          <TabsContent value="emails" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="space-y-2 pr-2">
                <AnimatePresence mode="popLayout">
                  {emails.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 text-muted-foreground"
                    >
                      <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No emails yet</p>
                      <p className="text-xs">Generate emails to see them here</p>
                    </motion.div>
                  ) : (
                    emails.map((email) => (
                      <motion.div
                        key={email.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArtifactItemCard
                          type="email"
                          item={email}
                          onEdit={() => handleEdit("email", email)}
                          onRefresh={onRefresh}
                        />
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>

      {/* Editor Sheet */}
      {editingItem && (
        <ArtifactEditorSheet
          type={editingItem.type}
          item={editingItem.item}
          open={!!editingItem}
          onClose={handleCloseEditor}
        />
      )}
    </div>
  );
}