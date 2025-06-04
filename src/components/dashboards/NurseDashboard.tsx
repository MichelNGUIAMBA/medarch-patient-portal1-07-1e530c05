
import React from 'react';
import { useUnifiedPatients } from '@/hooks/useUnifiedPatients';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { differenceInYears } from 'date-fns';
import StatsCard from '@/components/shared/StatsCard';

const NurseDashboard = () => {
  const { patients, loading } = useUnifiedPatients();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  // Filtrer les patients par statut
  const waitingPatients = patients.filter(p => p.status === 'En attente');
  const inProgressPatients = patients.filter(p => p.status === 'En cours');
  const completedPatients = patients.filter(p => p.status === 'Terminé');
  const urgentPatients = waitingPatients.filter(p => p.service === 'Ug');

  const getServiceBadgeColor = (service: string) => {
    switch (service) {
      case 'VM': return 'bg-blue-500';
      case 'Cons': return 'bg-green-500';
      case 'Ug': return 'bg-red-500';
      default: return 'bg-gray-500';
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Patients en attente"
          value={waitingPatients.length}
          icon={Clock}
          iconColor="text-orange-600"
        />

        <StatsCard
          title="En cours"
          value={inProgressPatients.length}
          icon={Users}
          iconColor="text-blue-600"
        />

        <StatsCard
          title="Terminés"
          value={completedPatients.length}
          icon={CheckCircle}
          iconColor="text-green-600"
        />

        <StatsCard
          title="Urgences"
          value={urgentPatients.length}
          icon={AlertTriangle}
          iconColor="text-red-600"
        />
      </div>

      {/* Waiting Patients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Patients en attente
          </CardTitle>
          <CardDescription>
            Liste des patients à prendre en charge par ordre d'arrivée
          </CardDescription>
        </CardHeader>
        <CardContent>
          {waitingPatients.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucun patient en attente
            </p>
          ) : (
            <div className="space-y-4">
              {waitingPatients.map((patient) => (
                <div key={patient.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`${getServiceBadgeColor(patient.service)} text-white`}>
                          {getServiceLabel(patient.service)}
                        </Badge>
                        <span className="font-medium">{patient.name}</span>
                        <span className="text-sm text-muted-foreground">
                          ({differenceInYears(new Date(), new Date(patient.birthDate))} ans, {patient.gender})
                        </span>
                      </div>
                      <p className="text-sm">
                        <strong>Société:</strong> {patient.company}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Arrivé le: {new Date(patient.registeredAt).toLocaleString()}
                      </p>
                    </div>
                    <Button>
                      Prendre en charge
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* In Progress Patients */}
      {inProgressPatients.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Patients en cours de traitement
            </CardTitle>
            <CardDescription>
              Patients actuellement pris en charge
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inProgressPatients.map((patient) => (
                <div key={patient.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                          En cours
                        </Badge>
                        <span className="font-medium">{patient.name}</span>
                        <Badge className={`${getServiceBadgeColor(patient.service)} text-white`}>
                          {getServiceLabel(patient.service)}
                        </Badge>
                      </div>
                      <p className="text-sm">
                        <strong>Société:</strong> {patient.company}
                      </p>
                    </div>
                    <Button variant="outline">
                      Continuer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NurseDashboard;
