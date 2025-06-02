
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { Key } from 'lucide-react';

interface UserCredentialsManagerProps {
  users: any[];
}

const UserCredentialsManager = ({ users }: UserCredentialsManagerProps) => {
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

export default UserCredentialsManager;
