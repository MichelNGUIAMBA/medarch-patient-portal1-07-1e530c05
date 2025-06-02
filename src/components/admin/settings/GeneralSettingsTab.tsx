
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import { Settings } from 'lucide-react';

interface GeneralSettingsTabProps {
  systemSettings: {
    systemName: string;
    maxPatientsPerDay: string;
    autoBackup: boolean;
    emailNotifications: boolean;
    maintenanceMode: boolean;
    sessionTimeout: string;
    systemAnnouncement: string;
  };
  setSystemSettings: React.Dispatch<React.SetStateAction<any>>;
  handleSettingSave: (settingName: string, value: any) => void;
}

const GeneralSettingsTab = ({ systemSettings, setSystemSettings, handleSettingSave }: GeneralSettingsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Paramètres généraux
        </CardTitle>
        <CardDescription>
          Configuration de base du système médical
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="systemName">Nom du système</Label>
            <Input
              id="systemName"
              value={systemSettings.systemName}
              onChange={(e) => setSystemSettings(prev => ({ ...prev, systemName: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxPatients">Max patients/jour</Label>
            <Input
              id="maxPatients"
              type="number"
              value={systemSettings.maxPatientsPerDay}
              onChange={(e) => setSystemSettings(prev => ({ ...prev, maxPatientsPerDay: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sessionTimeout">Timeout de session (minutes)</Label>
          <Input
            id="sessionTimeout"
            type="number"
            value={systemSettings.sessionTimeout}
            onChange={(e) => setSystemSettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="announcement">Annonce système</Label>
          <Textarea
            id="announcement"
            placeholder="Message d'annonce pour tous les utilisateurs..."
            value={systemSettings.systemAnnouncement}
            onChange={(e) => setSystemSettings(prev => ({ ...prev, systemAnnouncement: e.target.value }))}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="maintenance">Mode maintenance</Label>
          <Switch
            id="maintenance"
            checked={systemSettings.maintenanceMode}
            onCheckedChange={(checked) => handleSettingSave('maintenanceMode', checked)}
          />
        </div>

        <Button onClick={() => toast.success('Paramètres généraux sauvegardés')}>
          Sauvegarder les paramètres
        </Button>
      </CardContent>
    </Card>
  );
};

export default GeneralSettingsTab;
