import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileText, Clock, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  status: 'processing' | 'ready' | 'failed';
}

interface VaultDocumentsListProps {
  documents: Document[];
  onDocumentDelete: (id: string) => void;
  searchQuery?: string;
}

export function VaultDocumentsList({ documents, onDocumentDelete, searchQuery = "" }: VaultDocumentsListProps) {
  const { toast } = useToast();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDelete = (id: string, name: string) => {
    onDocumentDelete(id);
    toast({
      title: "Document deleted",
      description: `${name} has been removed from your knowledge vault.`,
    });
  };

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredDocuments.length === 0) {
    return (
      <Card className="p-12 text-center">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
        <p className="text-muted-foreground">
          {searchQuery ? "No documents match your search" : "No documents uploaded yet"}
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {filteredDocuments.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg ${
                doc.status === 'ready' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200' :
                doc.status === 'processing' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-200' :
                'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200'
              }`}>
                {doc.status === 'processing' ? (
                  <Clock className="h-5 w-5" />
                ) : (
                  <FileText className="h-5 w-5" />
                )}
              </div>
              
              <div>
                <h3 className="font-medium">{doc.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>{formatFileSize(doc.size)}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(doc.uploadedAt))} ago</span>
                  <span>•</span>
                  <Badge variant="secondary" className="text-xs">
                    Upload
                  </Badge>
                  <Badge 
                    variant={doc.status === 'ready' ? 'default' : 'secondary'}
                    className={`text-xs capitalize ${
                      doc.status === 'ready' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      doc.status === 'processing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {doc.status}
                  </Badge>
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(doc.id, doc.name)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}