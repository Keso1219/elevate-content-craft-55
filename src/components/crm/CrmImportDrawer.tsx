import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Download, Zap, Building2, Users, Handshake, FileText } from "lucide-react";
import { CrmImportDrawerProps, CrmImportConfig } from "@/types/crm";

const objectTypeOptions = [
  {
    id: 'company',
    label: 'Companies',
    icon: Building2,
    description: 'Import company profiles and organization data'
  },
  {
    id: 'contact',
    label: 'Contacts',
    icon: Users,
    description: 'Import contact information and personas'
  },
  {
    id: 'deal',
    label: 'Deals',
    icon: Handshake,
    description: 'Import deal stages, amounts, and outcomes'
  },
  {
    id: 'note',
    label: 'Notes',
    icon: FileText,
    description: 'Import engagement notes and activities'
  }
];

const derivationOptions = [
  {
    id: 'icp_snapshot',
    label: 'ICP Snapshot',
    description: 'Generate ideal customer profile from top companies'
  },
  {
    id: 'company_profile',
    label: 'Company Profiles',
    description: 'Create detailed profiles for key accounts'
  },
  {
    id: 'persona',
    label: 'Buyer Personas',
    description: 'Extract personas from contact roles and behaviors'
  },
  {
    id: 'objection_library',
    label: 'Objections Library',
    description: 'Mine common objections and proven responses'
  },
  {
    id: 'deal_summary',
    label: 'Deal Insights',
    description: 'Summarize deal patterns and win/loss factors'
  }
];

export function CrmImportDrawer({ isOpen, onClose, connection, onImport }: CrmImportDrawerProps) {
  const [selectedObjects, setSelectedObjects] = useState<string[]>(['company', 'contact', 'deal']);
  const [selectedDerivations, setSelectedDerivations] = useState<string[]>(['icp_snapshot', 'persona']);
  const [autoSync, setAutoSync] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleObjectToggle = (objectId: string, checked: boolean) => {
    if (checked) {
      setSelectedObjects(prev => [...prev, objectId]);
    } else {
      setSelectedObjects(prev => prev.filter(id => id !== objectId));
    }
  };

  const handleDerivationToggle = (derivationId: string, checked: boolean) => {
    if (checked) {
      setSelectedDerivations(prev => [...prev, derivationId]);
    } else {
      setSelectedDerivations(prev => prev.filter(id => id !== derivationId));
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const config: CrmImportConfig = {
        objectTypes: selectedObjects,
        autoSync,
        derivations: selectedDerivations
      };
      await onImport(config);
      onClose();
    } finally {
      setIsImporting(false);
    }
  };

  const estimatedTokens = selectedObjects.length * 1000 + selectedDerivations.length * 2000;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="space-y-3">
          <SheetTitle>Import CRM Data</SheetTitle>
          <SheetDescription>
            Select which data types to import and what knowledge documents to generate.
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Data Import Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Data to Import</h3>
              <p className="text-sm text-muted-foreground">
                Choose which CRM objects to sync into your knowledge vault
              </p>
            </div>

            <div className="space-y-3">
              {objectTypeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <div key={option.id} className="flex items-start space-x-3 p-3 border border-border rounded-lg">
                    <Checkbox
                      id={option.id}
                      checked={selectedObjects.includes(option.id)}
                      onCheckedChange={(checked) => handleObjectToggle(option.id, checked as boolean)}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <Label htmlFor={option.id} className="font-medium cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Knowledge Generation Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Knowledge Generation</h3>
              <p className="text-sm text-muted-foreground">
                AI will analyze your CRM data to create these knowledge documents
              </p>
            </div>

            <div className="space-y-3">
              {derivationOptions.map((option) => (
                <div key={option.id} className="flex items-start space-x-3 p-3 border border-border rounded-lg">
                  <Checkbox
                    id={`derive_${option.id}`}
                    checked={selectedDerivations.includes(option.id)}
                    onCheckedChange={(checked) => handleDerivationToggle(option.id, checked as boolean)}
                  />
                  <div className="flex-1 space-y-1">
                    <Label htmlFor={`derive_${option.id}`} className="font-medium cursor-pointer">
                      {option.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Settings Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-sync">Auto-sync</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically sync changes every hour
                </p>
              </div>
              <Switch
                id="auto-sync"
                checked={autoSync}
                onCheckedChange={setAutoSync}
              />
            </div>
          </div>

          {/* Cost Estimate */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Estimated Cost</div>
                <div className="text-sm text-muted-foreground">
                  ~{estimatedTokens.toLocaleString()} AI tokens
                </div>
              </div>
              <Badge variant="secondary">
                <Zap className="w-3 h-3 mr-1" />
                ~${(estimatedTokens * 0.0001).toFixed(2)}
              </Badge>
            </div>
          </div>

          {/* Import Button */}
          <Button 
            onClick={handleImport} 
            disabled={selectedObjects.length === 0 || isImporting}
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            {isImporting ? 'Importing...' : 'Import & Generate Knowledge'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}