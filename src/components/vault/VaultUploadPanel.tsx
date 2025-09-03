import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload as UploadIcon } from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  status: 'processing' | 'ready' | 'failed';
}

interface VaultUploadPanelProps {
  onDocumentsChange: (documents: Document[]) => void;
}

export function VaultUploadPanel({ onDocumentsChange }: VaultUploadPanelProps) {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const newDocuments: Document[] = [];
    
    files.forEach(file => {
      if (file.type === 'application/pdf' || file.type === 'text/csv') {
        const newDoc: Document = {
          id: Date.now().toString() + Math.random().toString(),
          name: file.name,
          type: file.type,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          status: 'processing'
        };
        
        newDocuments.push(newDoc);
        
        // Simulate processing
        setTimeout(() => {
          const processedDoc = { ...newDoc, status: 'ready' as const };
          onDocumentsChange([processedDoc]);
          
          toast({
            title: "Document processed",
            description: `${file.name} has been vectorized and added to your knowledge vault.`,
          });
        }, 2000);
      } else {
        toast({
          title: "Unsupported file type",
          description: "Please upload PDF or CSV files only.",
          variant: "destructive",
        });
      }
    });

    if (newDocuments.length > 0) {
      onDocumentsChange(newDocuments);
    }
  };

  return (
    <Card className="p-8">
      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <UploadIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">
          Drop your documents here, or click to browse
        </h3>
        <p className="text-muted-foreground mb-6">
          Supports PDF and CSV files up to 10MB each
        </p>
        
        <input
          type="file"
          multiple
          accept=".pdf,.csv"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button className="cursor-pointer">
            Select Files
          </Button>
        </label>
      </div>
    </Card>
  );
}