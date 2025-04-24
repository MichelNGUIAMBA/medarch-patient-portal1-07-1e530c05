
import React, { useState } from 'react';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, Lock, UserCheck, UserX, Edit, User } from 'lucide-react';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
  });
  
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: '',
  });

  // Mock users data
  const users = [
    { id: 1, firstName: 'Marie', lastName: 'Secrétaire', email: 'secretary@medarch.com', role: 'secretary', status: 'active', lastLogin: '2025-04-23 14:32:00' },
    { id: 2, firstName: 'Jean', lastName: 'Infirmier', email: 'nurse@medarch.com', role: 'nurse', status: 'active', lastLogin: '2025-04-23 08:15:00' },
    { id: 3, firstName: 'Lucie', lastName: 'Laboratoire', email: 'lab@medarch.com', role: 'lab', status: 'active', lastLogin: '2025-04-22 15:45:00' },
    { id: 4, firstName: 'Robert', lastName: 'Docteur', email: 'doctor@medarch.com', role: 'doctor', status: 'active', lastLogin: '2025-04-23 11:20:00' },
    { id: 5, firstName: 'Thomas', lastName: 'Dupont', email: 'thomas@medarch.com', role: 'secretary', status: 'inactive', lastLogin: '2025-04-10 09:30:00' },
  ];

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getRoleName(user.role).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (value: string) => {
    setNewUser(prev => ({
      ...prev,
      role: value
    }));
  };

  const handleAddUser = () => {
    // Validate form
    if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.role) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      toast.error("Adresse email invalide");
      return;
    }
    
    // In a real app, this would add the user to the database
    console.log("New user:", newUser);
    toast.success(`${newUser.firstName} ${newUser.lastName} a été ajouté avec succès`);
    
    // Reset form and close dialog
    setNewUser({
      firstName: '',
      lastName: '',
      email: '',
      role: '',
    });
    setIsAddUserOpen(false);
  };

  const handleChangePassword = () => {
    // Validate passwords
    if (!passwords.password || !passwords.confirmPassword) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    if (passwords.password !== passwords.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    
    if (passwords.password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    
    // In a real app, this would update the user's password in the database
    console.log(`Changing password for user ${selectedUser?.id}`);
    toast.success("Mot de passe modifié avec succès");
    
    // Reset form and close dialog
    setPasswords({
      password: '',
      confirmPassword: '',
    });
    setIsChangePasswordOpen(false);
  };

  const handleStatusToggle = (userId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    // In a real app, this would update the user's status in the database
    console.log(`Toggling user ${userId} status to ${newStatus}`);
    
    toast.success(`Statut modifié avec succès: ${newStatus === 'active' ? 'Actif' : 'Inactif'}`);
  };

  // Helper function to get role name in French
  function getRoleName(role: string): string {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'secretary':
        return 'Secrétaire';
      case 'nurse':
        return 'Infirmier(e)';
      case 'lab':
        return 'Laboratoire';
      case 'doctor':
        return 'Médecin';
      default:
        return role;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Nouvel utilisateur
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
                <DialogDescription>
                  Créez un compte pour un nouvel utilisateur du système
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={newUser.firstName}
                      onChange={handleInputChange}
                      placeholder="Prénom"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={newUser.lastName}
                      onChange={handleInputChange}
                      placeholder="Nom"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    placeholder="nom@exemple.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Select onValueChange={handleRoleChange} value={newUser.role}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="secretary">Secrétaire</SelectItem>
                      <SelectItem value="nurse">Infirmier(e)</SelectItem>
                      <SelectItem value="lab">Laboratoire</SelectItem>
                      <SelectItem value="doctor">Médecin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddUser}>
                  Ajouter
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière connexion</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-700" />
                        </div>
                        <div>
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleName(user.role)}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'active' ? 'default' : 'outline'} className={user.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'text-gray-500'}>
                        {user.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.lastLogin).toLocaleString('fr-FR', { 
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsChangePasswordOpen(true);
                          }}
                        >
                          <span className="sr-only">Changer le mot de passe</span>
                          <Lock className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                        >
                          <span className="sr-only">Modifier</span>
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant={user.status === 'active' ? 'destructive' : 'outline'}
                          className={`h-8 w-8 p-0 ${user.status !== 'active' && 'text-green-600 border-green-600 hover:bg-green-50'}`}
                          onClick={() => handleStatusToggle(user.id, user.status)}
                        >
                          <span className="sr-only">
                            {user.status === 'active' ? 'Désactiver' : 'Activer'}
                          </span>
                          {user.status === 'active' ? 
                            <UserX className="h-4 w-4" /> : 
                            <UserCheck className="h-4 w-4" />
                          }
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Change Password Dialog */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Changer le mot de passe</DialogTitle>
            <DialogDescription>
              {selectedUser && `Modifier le mot de passe pour ${selectedUser.firstName} ${selectedUser.lastName}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={passwords.password}
                onChange={handlePasswordChange}
                placeholder="Entrez le nouveau mot de passe"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmez le mot de passe</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirmez le nouveau mot de passe"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangePasswordOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleChangePassword}>
              Mettre à jour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
