
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import { useSupabaseAdmin } from '@/hooks/useSupabaseAdmin';
import { Shield, Database, Mail, Users, Settings, Key } from 'lucide-react';

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
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UserCredentialsManager users={users} />
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Gestion de la base de données
              </CardTitle>
              <CardDescription>
                Maintenance et statistiques de la base de données
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{users.length}</div>
                  <p className="text-sm text-muted-foreground">Utilisateurs total</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold">~500MB</div>
                  <p className="text-sm text-muted-foreground">Taille de la DB</p>
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full" onClick={() => toast.success('Optimisation démarrée...')}>
                  Optimiser la base de données
                </Button>
                <Button variant="outline" className="w-full" onClick={() => toast.success('Nettoyage démarré...')}>
                  Nettoyer les données temporaires
                </Button>
                <Button variant="outline" className="w-full" onClick={() => window.open('https://supabase.com/dashboard/project/vngnehmsavxtfeoumuvy', '_blank')}>
                  Ouvrir la console Supabase
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Composant pour la gestion des identifiants utilisateurs
const UserCredentialsManager = ({ users }: { users: any[] }) => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const handlePasswordReset = async () => {
    if (!selectedUser || !newPassword) {
      toast.error('Veuillez sélectionner un utilisateur et saisir un mot de passe');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    // Simulation de la réinitialisation du mot de passe
    toast.success(`Mot de passe réinitialisé pour ${selectedUser.name}`);
    setNewPassword('');
  };

  const handleEmailChange = async () => {
    if (!selectedUser || !newEmail) {
      toast.error('Veuillez sélectionner un utilisateur et saisir un email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast.error('Adresse email invalide');
      return;
    }

    // Simulation du changement d'email
    toast.success(`Email modifié pour ${selectedUser.name}`);
    setNewEmail('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Gestion des identifiants utilisateurs
        </CardTitle>
        <CardDescription>
          Modifier les emails et mots de passe des utilisateurs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Sélectionner un utilisateur</Label>
          <select 
            className="w-full p-2 border rounded-md"
            value={selectedUser?.id || ''}
            onChange={(e) => {
              const user = users.find(u => u.id === e.target.value);
              setSelectedUser(user);
              setNewEmail(user?.email || '');
            }}
          >
            <option value="">Choisir un utilisateur...</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </div>

        {selectedUser && (
          <>
            <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
              <h4 className="font-medium">Utilisateur sélectionné</h4>
              <p className="text-sm text-muted-foreground">{selectedUser.name}</p>
              <p className="text-sm text-muted-foreground">Rôle: {selectedUser.role}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newEmail">Nouvel email</Label>
                <Input
                  id="newEmail"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="nouvel@email.com"
                />
                <Button onClick={handleEmailChange} variant="outline" size="sm">
                  Modifier l'email
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nouveau mot de passe (min. 6 caractères)"
                />
                <Button onClick={handlePasswordReset} variant="outline" size="sm">
                  Réinitialiser le mot de passe
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminSettings;
