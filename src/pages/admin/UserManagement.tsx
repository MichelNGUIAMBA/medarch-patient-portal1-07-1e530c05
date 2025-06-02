
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
import { Search, UserPlus, Edit, User, Trash2, AlertTriangle } from 'lucide-react';
import { useSupabaseAdmin } from '@/hooks/useSupabaseAdmin';

const UserManagement = () => {
  const { users, loading, createUser, updateUserRole, deleteUser } = useSupabaseAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
  });

  const [editUser, setEditUser] = useState({
    role: '',
  });

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getRoleName(user.role).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
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

  const handleEditRoleChange = (value: string) => {
    setEditUser(prev => ({
      ...prev,
      role: value
    }));
  };

  const handleAddUser = async () => {
    // Validate form
    if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.role || !newUser.password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      toast.error("Adresse email invalide");
      return;
    }

    if (newUser.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    
    setActionLoading(true);
    try {
      await createUser(
        newUser.email, 
        newUser.password, 
        `${newUser.firstName} ${newUser.lastName}`, 
        newUser.role
      );
      toast.success(`${newUser.firstName} ${newUser.lastName} a été ajouté avec succès`);
      
      // Reset form and close dialog
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: '',
      });
      setIsAddUserOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la création de l'utilisateur");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditUser = async () => {
    if (!editUser.role) {
      toast.error("Veuillez sélectionner un rôle");
      return;
    }

    setActionLoading(true);
    try {
      await updateUserRole(selectedUser?.id, editUser.role);
      toast.success("Utilisateur modifié avec succès");
      
      setIsEditUserOpen(false);
      setEditUser({ role: '' });
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la modification de l'utilisateur");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${userName} ?`)) {
      return;
    }

    setActionLoading(true);
    try {
      await deleteUser(userId);
      toast.success("Utilisateur supprimé avec succès");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression de l'utilisateur");
    } finally {
      setActionLoading(false);
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
      </div>
    );
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
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
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
                <Button onClick={handleAddUser} disabled={actionLoading}>
                  {actionLoading ? "Création..." : "Ajouter"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Avertissement pour les fonctionnalités limitées */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-800">
                <strong>Fonctionnalités limitées :</strong> Le changement de mot de passe et la gestion du statut utilisateur nécessitent des privilèges administrateur spéciaux qui ne sont pas disponibles avec les permissions standard.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
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
                          <p className="font-medium">{user.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getRoleName(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setSelectedUser(user);
                            setEditUser({ role: user.role });
                            setIsEditUserOpen(true);
                          }}
                        >
                          <span className="sr-only">Modifier</span>
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        {user.role !== 'admin' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 w-8 p-0"
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            disabled={actionLoading}
                          >
                            <span className="sr-only">Supprimer</span>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>
              {selectedUser && `Modifier les informations de ${selectedUser.name}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editRole">Rôle</Label>
              <Select onValueChange={handleEditRoleChange} value={editUser.role}>
                <SelectTrigger id="editRole">
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
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditUser} disabled={actionLoading}>
              {actionLoading ? "Modification..." : "Mettre à jour"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
