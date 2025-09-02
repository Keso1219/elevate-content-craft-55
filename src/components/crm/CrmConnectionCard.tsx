import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, Settings, Unplug, ExternalLink } from "lucide-react";
import { CrmConnectionCardProps } from "@/types/crm";
import { formatDistanceToNow } from "date-fns";

export function CrmConnectionCard({ 
  connection, 
  provider, 
  stats, 
  onConnect, 
  onSync, 
  onDisconnect 
}: CrmConnectionCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async () => {
    setIsLoading(true);
    try {
      await onSync();
    } finally {
      setIsLoading(false);
    }
  };

  const isConnected = connection?.status === 'connected';

  return (
    <Card className="relative overflow-hidden border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-foreground">
              {provider.name}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {provider.description}
            </CardDescription>
          </div>
          <Badge 
            variant={isConnected ? "default" : "secondary"}
            className={isConnected ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""}
          >
            {isConnected ? "Connected" : "Not Connected"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Connection Stats */}
        {isConnected && stats && (
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">{stats.companies}</div>
              <div className="text-xs text-muted-foreground">Companies</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">{stats.contacts}</div>
              <div className="text-xs text-muted-foreground">Contacts</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">{stats.deals}</div>
              <div className="text-xs text-muted-foreground">Deals</div>
            </div>
          </div>
        )}

        {/* Last Sync Info */}
        {isConnected && connection?.last_sync_at && (
          <>
            <Separator />
            <div className="text-sm text-muted-foreground">
              Last synced {formatDistanceToNow(new Date(connection.last_sync_at))} ago
            </div>
          </>
        )}

        <Separator />

        {/* Action Buttons */}
        <div className="flex gap-2">
          {!isConnected ? (
            <Button 
              onClick={onConnect} 
              disabled={!provider.enabled}
              className="flex-1"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Connect {provider.name}
            </Button>
          ) : (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSync}
                disabled={isLoading}
                className="flex-1"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Sync Now
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1"
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onDisconnect}
              >
                <Unplug className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        {!provider.enabled && (
          <div className="text-xs text-muted-foreground italic">
            Coming soon - {provider.name} integration is in development
          </div>
        )}
      </CardContent>
    </Card>
  );
}