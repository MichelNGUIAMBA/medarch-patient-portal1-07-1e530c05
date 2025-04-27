
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Hospital, ClipboardCheck } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Utilisateurs actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-2xl font-bold">24</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Entreprises partenaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Hospital className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-2xl font-bold">4</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dossiers ouverts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ClipboardCheck className="h-5 w-5 text-purple-600 mr-2" />
              <span className="text-2xl font-bold">345</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Utilisateurs récents</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {[
                { name: "Jean Dupont", role: "Infirmier", date: "Il y a 2 heures" },
                { name: "Marie Lambert", role: "Secrétaire", date: "Il y a 5 heures" },
                { name: "Dr. Martin", role: "Médecin", date: "Il y a 1 jour" },
              ].map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                      {user.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.role}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{user.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Actions système</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {[
                { action: "Nouveau compte créé", user: "Admin", date: "Il y a 1 heure" },
                { action: "Mise à jour du système", user: "Système", date: "Il y a 1 jour" },
                { action: "Sauvegarde des données", user: "Système", date: "Il y a 2 jours" },
              ].map((log, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <div className="font-medium">{log.action}</div>
                    <div className="text-sm text-gray-500">Par {log.user}</div>
                  </div>
                  <div className="text-sm text-gray-500">{log.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
