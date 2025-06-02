
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAdmin } from '@/hooks/useSupabaseAdmin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Database, Shield, Settings, User, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import StatsCard from '@/components/shared/StatsCard';

const AdminDashboard = () => {
  const { users, patients, stats, loading, loadAllData } = useSupabaseAdmin();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleRefresh = () => {
    loadAllData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-500';
      case 'secretary': return 'bg-blue-500';
      case 'nurse': return 'bg-green-500';
      case 'lab': return 'bg-orange-500';
      case 'doctor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'secretary': return 'Secrétaire';
      case 'nurse': return 'Infirmier(ère)';
      case 'lab': return 'Laboratoire';
      case 'doctor': return 'Médecin';
      default: return role;
    }
  };

  const getServiceLabel = (service: string) => {
    switch (service) {
      case 'VM': return 'Visite Médicale';
      case 'Cons': return 'Consultation';
      case 'Ug': return 'Urgence';
      default: return service;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tableau de bord administrateur</h1>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatsCard
          title="Total Patients"
          value={stats?.totalPatients || 0}
          icon={User}
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Utilisateurs actifs"
          value={stats?.totalUsers || 0}
          icon={Shield}
          iconColor="text-purple-600"
        />
      </div>

      {/* Users by Role */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Répartition des utilisateurs par rôle
          </CardTitle>
          <CardDescription>
            Distribution des rôles dans le système
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(stats?.usersByRole || {}).map(([role, count]) => (
              <div key={role} className="text-center p-4 border rounded-lg">
                <Badge className={`${getRoleBadgeColor(role)} text-white mb-2`}>
                  {getRoleLabel(role)}
                </Badge>
                <div className="text-2xl font-bold">{count}</div>
                <p className="text-xs text-muted-foreground">utilisateurs</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Patients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Patients récemment enregistrés
          </CardTitle>
          <CardDescription>
            Derniers patients ajoutés au système
          </CardDescription>
        </CardHeader>
        <CardContent>
          {patients.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucun patient trouvé
            </p>
          ) : (
            <div className="space-y-4">
              {patients.map((patient) => (
                <div key={patient.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium uppercase">{patient.name}</span>
                        <Badge className="bg-blue-500 text-white">
                          {getServiceLabel(patient.service)}
                        </Badge>
                        <Badge variant="outline">
                          {patient.status}
                        </Badge>
                      </div>
                      {patient.companies?.name && (
                        <p className="text-sm text-muted-foreground mb-1">
                          Entreprise: {patient.companies.name}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Enregistré le: {new Date(patient.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Utilisateurs récents
          </CardTitle>
          <CardDescription>
            Derniers comptes créés dans le système
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucun utilisateur trouvé
            </p>
          ) : (
            <div className="space-y-4">
              {users.slice(0, 5).map((user) => (
                <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{user.name}</span>
                        <Badge className={`${getRoleBadgeColor(user.role)} text-white`}>
                          {getRoleLabel(user.role)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Créé le: {new Date(user.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Outils d'administration du système
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => navigate('/dashboard/admin/users')}
            >
              <Users className="h-6 w-6 mb-2" />
              Gérer utilisateurs
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => window.open('https://supabase.com/dashboard/project/vngnehmsavxtfeoumuvy', '_blank')}
            >
              <Database className="h-6 w-6 mb-2" />
              Console Supabase
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => navigate('/dashboard/admin/settings')}
            >
              <Settings className="h-6 w-6 mb-2" />
              Paramètres
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => navigate('/dashboard/admin/users')}
            >
              <Shield className="h-6 w-6 mb-2" />
              Sécurité
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
