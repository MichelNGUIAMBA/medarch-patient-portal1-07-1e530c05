
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/sonner';
import { Shield, Database } from 'lucide-react';

interface SecuritySettingsTabProps {
  systemSettings: {
    autoBackup: boolean;
  };
  handleSettingSave: (settingName: string, value: any) => void;
  handleSystemBackup: () => void;
  handleSystemReset: () => void;
}

const SecuritySettingsTab = ({ systemSettings, handleSettingSave, handleSystemBackup, handleSystemReset }: SecuritySettingsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Paramètres de sécurité
        </CardTitle>
        <CardDescription>
          Configuration de la sécurité et des accès
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Authentification à deux facteurs</Label>
            <p className="text-sm text-muted-foreground">Activer 2FA pour tous les comptes admin</p>
          </div>
          <Switch />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Sauvegarde automatique</Label>
            <p className="text-sm text-muted-foreground">Sauvegarde quotidienne des données</p>
          </div>
          <Switch
            checked={systemSettings.autoBackup}
            onCheckedChange={(checked) => handleSettingSave('autoBackup', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Logs d'audit</Label>
            <p className="text-sm text-muted-foreground">Enregistrer toutes les actions utilisateurs</p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="pt-4 space-y-2">
          <Button onClick={handleSystemBackup} className="w-full">
            <Database className="h-4 w-4 mr-2" />
            Lancer une sauvegarde manuelle
          </Button>
          <Button variant="destructive" onClick={handleSystemReset} className="w-full">
            Réinitialiser les paramètres système
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySettingsTab;
