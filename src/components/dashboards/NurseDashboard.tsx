
import React from 'react';
import { useSupabaseNurse } from '@/hooks/useSupabaseNurse';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { differenceInYears } from 'date-fns';

const NurseDashboard = () => {
  const { waitingPatients, inProgressPatients, completedPatients, loading, takeChargeOfPatient } = useSupabaseNurse();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
      </div>
    );
  }

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

  const handleTakeCharge = async (patientId: string) => {
    try {
      await takeChargeOfPatient(patientId);
    } catch (error) {
      console.error('Error taking charge:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients en attente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{waitingPatients.length}</div>
            <p className="text-xs text-muted-foreground">À prendre en charge</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgressPatients.length}</div>
            <p className="text-xs text-muted-foreground">En traitement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terminés</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedPatients.length}</div>
            <p className="text-xs text-muted-foreground">Aujourd'hui</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgences</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {waitingPatients.filter(p => p.service === 'Ug').length}
            </div>
            <p className="text-xs text-muted-foreground">Priorité haute</p>
          </CardContent>
        </Card>
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
                          ({differenceInYears(new Date(), new Date(patient.birth_date))} ans, {patient.gender})
                        </span>
                      </div>
                      <p className="text-sm">
                        <strong>Société:</strong> {patient.companies?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Arrivé le: {new Date(patient.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Button onClick={() => handleTakeCharge(patient.id)}>
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
                        <strong>Société:</strong> {patient.companies?.name}
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
