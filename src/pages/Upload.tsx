import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload as UploadIcon, FileText, Trash2, Clock } from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  status: 'processing' | 'ready' | 'failed';
}

export default function Upload() {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Brand Guidelines 2024.pdf',
      type: 'application/pdf',
      size: 2456789,
      uploadedAt: '2024-01-15T10:30:00Z',
      status: 'ready'
    },
    {
      id: '2',
      name: 'Content Strategy.csv',
      type: 'text/csv',
      size: 125430,
      uploadedAt: '2024-01-14T15:45:00Z',
      status: 'ready'
    }
  ]);

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
    files.forEach(file => {
      if (file.type === 'application/pdf' || file.type === 'text/csv') {
        const newDoc: Document = {
          id: Date.now().toString(),
          name: file.name,
          type: file.type,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          status: 'processing'
        };
        
        setDocuments(prev => [newDoc, ...prev]);
        
        // Simulate processing
        setTimeout(() => {
          setDocuments(prev => 
            prev.map(doc => 
              doc.id === newDoc.id ? { ...doc, status: 'ready' } : doc
            )
          );
          
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
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    toast({
      title: "Document deleted",
      description: "The document has been removed from your knowledge vault.",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Knowledge Vault</h1>
          <p className="text-muted-foreground">
            Upload your documents to create a personalized knowledge base for AI content generation.
          </p>
        </div>

        {/* Upload Zone */}
        <Card className="p-8 mb-8">
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

        {/* Documents List */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Your Documents</h2>
          
          {documents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No documents uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      doc.status === 'ready' ? 'bg-green-100 text-green-600' :
                      doc.status === 'processing' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
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
                        <span>{formatDate(doc.uploadedAt)}</span>
                        <span>•</span>
                        <span className={`capitalize ${
                          doc.status === 'ready' ? 'text-green-600' :
                          doc.status === 'processing' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {doc.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteDocument(doc.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}