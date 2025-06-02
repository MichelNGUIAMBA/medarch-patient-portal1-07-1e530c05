
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';
import { useSupabaseAdmin } from '@/hooks/useSupabaseAdmin';
import { Shield } from 'lucide-react';
import GeneralSettingsTab from '@/components/admin/settings/GeneralSettingsTab';
import SecuritySettingsTab from '@/components/admin/settings/SecuritySettingsTab';
import UserCredentialsManager from '@/components/admin/settings/UserCredentialsManager';
import DatabaseSettingsTab from '@/components/admin/settings/DatabaseSettingsTab';
import NotificationsSettingsTab from '@/components/admin/settings/NotificationsSettingsTab';

const AdminSettings = () => {
  const { users } = useSupabaseAdmin();
  const [systemSettings, setSystemSettings] = useState({
    systemName: 'MedArch',
    maxPatientsPerDay: '100',
    autoBackup: true,
    emailNotifications: true,
    maintenanceMode: false,
    sessionTimeout: '30',
    systemAnnouncement: ''
  });

  const handleSettingSave = (settingName: string, value: any) => {
    setSystemSettings(prev => ({ ...prev, [settingName]: value }));
    toast.success(`Paramètre "${settingName}" mis à jour`);
  };

  const handleSystemBackup = () => {
    toast.success('Sauvegarde du système démarrée...');
    // Logique de sauvegarde ici
  };

  const handleSystemReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser les paramètres système ? Cette action est irréversible.')) {
      toast.success('Paramètres système réinitialisés');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Paramètres système</h1>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <span className="text-sm text-muted-foreground">Administration</span>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="database">Base de données</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <GeneralSettingsTab
            systemSettings={systemSettings}
            setSystemSettings={setSystemSettings}
            handleSettingSave={handleSettingSave}
          />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <SecuritySettingsTab
            systemSettings={systemSettings}
            handleSettingSave={handleSettingSave}
            handleSystemBackup={handleSystemBackup}
            handleSystemReset={handleSystemReset}
          />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UserCredentialsManager users={users} />
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <DatabaseSettingsTab usersCount={users.length} />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <NotificationsSettingsTab
            systemSettings={systemSettings}
            handleSettingSave={handleSettingSave}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
