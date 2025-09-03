import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Plus } from "lucide-react";
import { CrmConnectionCard } from "@/components/crm/CrmConnectionCard";
import { CrmImportDrawer } from "@/components/crm/CrmImportDrawer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CrmConnection, CrmProvider, CrmStats, CrmImportConfig } from "@/types/crm";

export function VaultCRMConnections() {
  const [crmConnections, setCrmConnections] = useState<CrmConnection[]>([]);
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
      }, 3000);
    } catch (error) {
      toast({
        title: "Import Failed", 
        description: "Failed to import CRM data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const connectedCrms = crmConnections.filter(c => c.status === 'connected');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">CRM Connections</h2>
          <p className="text-sm text-muted-foreground">
            Connect your CRM to import customer data and generate insights
          </p>
        </div>
        <Button 
          variant="outline"
          onClick={() => setIsImportDrawerOpen(true)}
          disabled={connectedCrms.length === 0}
        >
          <Database className="w-4 h-4 mr-2" />
          Import Data
        </Button>
      </div>

      {connectedCrms.length === 0 ? (
        <Card className="p-12 text-center">
          <Database className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No CRM Connected</h3>
          <p className="text-muted-foreground mb-4">
            Connect your CRM to start generating knowledge documents from your customer data
          </p>
          <Button onClick={() => handleConnect(providers[0])}>
            <Plus className="w-4 h-4 mr-2" />
            Connect HubSpot
          </Button>
        </Card>
      ) : (
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
      )}

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