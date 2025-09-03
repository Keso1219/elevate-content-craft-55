import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, FileText, Users, Building2, Target, MessageSquare } from "lucide-react";
import { VaultUploadPanel } from "@/components/vault/VaultUploadPanel";
import { VaultDocumentsList } from "@/components/vault/VaultDocumentsList";
import { VaultCRMConnections } from "@/components/vault/VaultCRMConnections";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { VaultDoc } from "@/types/crm";
import { formatDistanceToNow } from "date-fns";

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  status: 'processing' | 'ready' | 'failed';
}

export default function Vault() {
  const [searchQuery, setSearchQuery] = useState("");
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
  const [vaultDocs, setVaultDocs] = useState<VaultDoc[]>([]);
  const { toast } = useToast();

  // Load vault documents
  useEffect(() => {
    loadVaultDocs();
  }, []);

  const handleDocumentsChange = (newDocs: Document[]) => {
    setDocuments(prev => {
      // Add new documents or update existing ones
      const updated = [...prev];
      newDocs.forEach(newDoc => {
        const existingIndex = updated.findIndex(doc => doc.id === newDoc.id);
        if (existingIndex >= 0) {
          updated[existingIndex] = newDoc;
        } else {
          updated.unshift(newDoc);
        }
      });
      return updated;
    });
  };

  const handleDocumentDelete = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const loadVaultDocs = async () => {
    try {
      const { data, error } = await supabase
        .from('vault_docs')
        .select('*')
        .eq('source', 'crm')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVaultDocs(data || []);
    } catch (error) {
      console.error('Failed to load vault docs:', error);
    }
  };

  const getDocIcon = (docType: string) => {
    switch (docType) {
      case 'icp_snapshot': return Target;
      case 'company_profile': return Building2;
      case 'persona': return Users;
      case 'objection_library': return MessageSquare;
      case 'deal_summary': return FileText;
      default: return FileText;
    }
  };

  const filteredDocs = vaultDocs.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.doc_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Knowledge Vault</h1>
            <p className="text-muted-foreground mt-2">
              Upload company docs and connect your CRM to generate AI knowledge
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search knowledge documents..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Upload Documents Section */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Upload Documents</h2>
              <p className="text-sm text-muted-foreground">
                Upload your company documents to create AI-powered knowledge
              </p>
            </div>
            
            <VaultUploadPanel onDocumentsChange={handleDocumentsChange} />
          </div>

          {/* Your Documents Section */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Your Documents</h2>
              <p className="text-sm text-muted-foreground">
                Previously uploaded documents ready for AI processing
              </p>
            </div>

            <VaultDocumentsList 
              documents={documents}
              onDocumentDelete={handleDocumentDelete}
              searchQuery={searchQuery}
            />
          </div>

          <Separator />

          {/* CRM Connections Section */}
          <VaultCRMConnections />

          {/* CRM-Derived Knowledge Documents */}
          {filteredDocs.length > 0 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">CRM Insights</h2>
                <p className="text-sm text-muted-foreground">
                  AI-generated knowledge documents from your CRM data
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredDocs.map((doc) => {
                  const Icon = getDocIcon(doc.doc_type);
                  return (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <Icon className="w-5 h-5 text-primary" />
                            <CardTitle className="text-lg">{doc.title}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                          {doc.content.substring(0, 150)}...
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            <Badge variant="secondary" className="text-xs">
                              CRM
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {doc.doc_type.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(doc.created_at))} ago
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}