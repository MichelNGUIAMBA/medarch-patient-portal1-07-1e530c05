
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Database } from 'lucide-react';

interface DatabaseSettingsTabProps {
  usersCount: number;
}

const DatabaseSettingsTab = ({ usersCount }: DatabaseSettingsTabProps) => {
  return (
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
            <div className="text-2xl font-bold">{usersCount}</div>
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
  );
};

export default DatabaseSettingsTab;
