
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/sonner';
import { Mail } from 'lucide-react';

interface NotificationsSettingsTabProps {
  systemSettings: {
    emailNotifications: boolean;
  };
  handleSettingSave: (settingName: string, value: any) => void;
}

const NotificationsSettingsTab = ({ systemSettings, handleSettingSave }: NotificationsSettingsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Paramètres des notifications
        </CardTitle>
        <CardDescription>
          Configuration des alertes et notifications système
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Notifications email</Label>
            <p className="text-sm text-muted-foreground">Alertes par email pour les admins</p>
          </div>
          <Switch
            checked={systemSettings.emailNotifications}
            onCheckedChange={(checked) => handleSettingSave('emailNotifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Alertes d'urgence</Label>
            <p className="text-sm text-muted-foreground">Notifications pour les cas d'urgence</p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Rappels automatiques</Label>
            <p className="text-sm text-muted-foreground">Rappels pour les rendez-vous</p>
          </div>
          <Switch />
        </div>

        <div className="space-y-2">
          <Label>Email administrateur principal</Label>
          <Input type="email" placeholder="admin@medarch.com" />
        </div>

        <Button onClick={() => toast.success('Paramètres de notification sauvegardés')}>
          Sauvegarder les paramètres
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationsSettingsTab;
