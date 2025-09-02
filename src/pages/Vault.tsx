import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Plus, Database, FileText, Users, Building2, Target, MessageSquare } from "lucide-react";
import { CrmConnectionCard } from "@/components/crm/CrmConnectionCard";
import { CrmImportDrawer } from "@/components/crm/CrmImportDrawer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CrmConnection, CrmProvider, CrmStats, VaultDoc, CrmImportConfig } from "@/types/crm";
import { formatDistanceToNow } from "date-fns";

export default function Vault() {
  const [searchQuery, setSearchQuery] = useState("");
  const [crmConnections, setCrmConnections] = useState<CrmConnection[]>([]);
  const [vaultDocs, setVaultDocs] = useState<VaultDoc[]>([]);
  const [crmStats, setCrmStats] = useState<Record<string, CrmStats>>({});
  const [isImportDrawerOpen, setIsImportDrawerOpen] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<CrmConnection | undefined>();
  const { toast } = useToast();

  // Available CRM providers
  const providers: CrmProvider[] = [
    {
      id: 'hubspot',
      name: 'HubSpot',
      enabled: true,
      description: 'Connect your HubSpot CRM to import companies, contacts, and deals'
    },
    {
      id: 'salesforce', 
      name: 'Salesforce',
      enabled: false,
      description: 'Coming soon - Salesforce integration'
    },
    {
      id: 'pipedrive',
      name: 'Pipedrive', 
      enabled: false,
      description: 'Coming soon - Pipedrive integration'
    }
  ];

  // Load CRM connections
  useEffect(() => {
    loadCrmConnections();
    loadVaultDocs();
  }, []);

  const loadCrmConnections = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_connections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCrmConnections(data || []);

      // Load stats for each connection
      for (const connection of data || []) {
        await loadCrmStats(connection.id, connection.provider);
      }
    } catch (error) {
      console.error('Failed to load CRM connections:', error);
    }
  };

  const loadCrmStats = async (connectionId: string, provider: string) => {
    try {
      const { data, error } = await supabase
        .from('crm_objects')
        .select('object_type')
        .eq('connection_id', connectionId);

      if (error) throw error;

      const stats: CrmStats = {
        companies: data?.filter(obj => obj.object_type === 'company').length || 0,
        contacts: data?.filter(obj => obj.object_type === 'contact').length || 0,
        deals: data?.filter(obj => obj.object_type === 'deal').length || 0,
        notes: data?.filter(obj => obj.object_type === 'note').length || 0,
      };

      setCrmStats(prev => ({
        ...prev,
        [connectionId]: stats
      }));
    } catch (error) {
      console.error('Failed to load CRM stats:', error);
    }
  };

  const loadVaultDocs = async () => {
    try {
      const { data, error } = await supabase
        .from('vault_docs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVaultDocs(data || []);
    } catch (error) {
      console.error('Failed to load vault docs:', error);
    }
  };

  const handleConnect = async (provider: CrmProvider) => {
    if (!provider.enabled) {
      toast({
        title: "Coming Soon",
        description: `${provider.name} integration is currently in development.`,
        variant: "default",
      });
      return;
    }

    try {
      // Call Supabase Edge Function to start OAuth
      const { data, error } = await supabase.functions.invoke('crm-oauth-start', {
        body: { provider: provider.id }
      });

      if (error) throw error;

      // Redirect to HubSpot OAuth
      window.location.href = data.authUrl;
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to start OAuth flow. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSync = async (connection: CrmConnection) => {
    try {
      const { data, error } = await supabase.functions.invoke('crm-sync', {
        body: {
          objectTypes: ['company', 'contact', 'deal'],
          mode: 'delta'
        }
      });

      if (error) throw error;

      toast({
        title: "Sync Started",
        description: "Your CRM data is being synced in the background.",
      });

      // Reload connections to update last sync time
      setTimeout(() => loadCrmConnections(), 2000);
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to start CRM sync. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async (connection: CrmConnection) => {
    try {
      const { error } = await supabase
        .from('crm_connections')
        .update({ status: 'disconnected' })
        .eq('id', connection.id);

      if (error) throw error;

      toast({
        title: "Disconnected",
        description: `${connection.provider} has been disconnected.`,
      });

      loadCrmConnections();
    } catch (error) {
      toast({
        title: "Disconnect Failed",
        description: "Failed to disconnect CRM. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImport = async (config: CrmImportConfig) => {
    try {
      // Start sync
      const { data: syncData, error: syncError } = await supabase.functions.invoke('crm-sync', {
        body: {
          objectTypes: config.objectTypes,
          mode: 'backfill'
        }
      });

      if (syncError) throw syncError;

      toast({
        title: "Import Started",
        description: "Your CRM data is being imported and knowledge documents are being generated.",
      });

      // Reload data
      setTimeout(() => {
        loadCrmConnections();
        loadVaultDocs();
      }, 3000);
    } catch (error) {
      toast({
        title: "Import Failed", 
        description: "Failed to import CRM data. Please try again.",
        variant: "destructive",
      });
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

  const crmDerivedDocs = filteredDocs.filter(doc => 
    ['icp_snapshot', 'company_profile', 'persona', 'objection_library', 'deal_summary'].includes(doc.doc_type)
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Knowledge Vault</h1>
            <p className="text-muted-foreground mt-2">
              Connect your CRM and generate AI-powered knowledge documents for content creation
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

          {/* CRM Connections Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">CRM Connections</h2>
                <p className="text-sm text-muted-foreground">
                  Connect your CRM to import customer data and generate insights
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={() => setIsImportDrawerOpen(true)}
                disabled={crmConnections.filter(c => c.status === 'connected').length === 0}
              >
                <Database className="w-4 h-4 mr-2" />
                Import Data
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {providers.map((provider) => {
                const connection = crmConnections.find(c => c.provider === provider.id);
                const stats = connection ? crmStats[connection.id] : undefined;

                return (
                  <CrmConnectionCard
                    key={provider.id}
                    provider={provider}
                    connection={connection}
                    stats={stats}
                    onConnect={() => handleConnect(provider)}
                    onSync={() => connection && handleSync(connection)}
                    onDisconnect={() => connection && handleDisconnect(connection)}
                  />
                );
              })}
            </div>
          </div>

          <Separator />

          {/* CRM-Derived Knowledge Documents */}
          {crmDerivedDocs.length > 0 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">CRM Insights</h2>
                <p className="text-sm text-muted-foreground">
                  AI-generated knowledge documents from your CRM data
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {crmDerivedDocs.map((doc) => {
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
                              crm
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

          {/* Empty State */}
          {crmDerivedDocs.length === 0 && crmConnections.filter(c => c.status === 'connected').length === 0 && (
            <div className="text-center py-12">
              <Database className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No CRM Connected</h3>
              <p className="text-muted-foreground mb-4">
                Connect your CRM to start generating knowledge documents from your customer data
              </p>
              <Button onClick={() => handleConnect(providers[0])}>
                <Plus className="w-4 h-4 mr-2" />
                Connect HubSpot
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Import Drawer */}
      <CrmImportDrawer
        isOpen={isImportDrawerOpen}
        onClose={() => setIsImportDrawerOpen(false)}
        connection={selectedConnection}
        onImport={handleImport}
      />
    </div>
  );
}