
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  AlertTriangle, 
  Clock, 
  Eye, 
  FileCheck, 
  UserCheck, 
  Stethoscope,
  Calendar
} from 'lucide-react';
import { Patient } from '@/types/patient';

interface PriorityPatientCardProps {
  patient: Patient & { 
    priorityScore?: number; 
    aiSummary?: string; 
    legalDeadline?: string;
    quickConsultationMode?: boolean;
  };
  onViewPatient: (patientId: string) => void;
  onQuickDecision: (patientId: string, decision: string) => void;
}

const PriorityPatientCard: React.FC<PriorityPatientCardProps> = ({ 
  patient, 
  onViewPatient, 
  onQuickDecision 
}) => {
  const getPriorityColor = (score?: number) => {
    if (!score) return 'bg-gray-500';
    if (score >= 80) return 'bg-red-500';
    if (score >= 60) return 'bg-orange-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPriorityLabel = (score?: number) => {
    if (!score) return 'Normal';
    if (score >= 80) return 'Critique';
    if (score >= 60) return 'Élevé';
    if (score >= 40) return 'Modéré';
    return 'Normal';
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const quickDecisions = [
    { id: 'sick_leave', label: 'Arrêt Maladie', icon: FileCheck },
    { id: 'specialist', label: 'Spécialiste', icon: UserCheck },
    { id: 'follow_up', label: 'Suivi', icon: Calendar }
  ];

  return (
    <Card className={`hover:shadow-md transition-shadow ${
      patient.priorityScore && patient.priorityScore >= 80 ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : ''
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Priority Indicator */}
          <div className="flex flex-col items-center gap-1">
            <div className={`w-3 h-8 rounded-full ${getPriorityColor(patient.priorityScore)}`} />
            <span className="text-xs font-medium">
              {patient.priorityScore || 0}
            </span>
          </div>

          {/* Avatar */}
          <Avatar className="h-12 w-12">
            <AvatarImage src={`/api/placeholder/48/48`} alt={patient.name} />
            <AvatarFallback>{getInitials(patient.firstName, patient.lastName)}</AvatarFallback>
          </Avatar>

          {/* Patient Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-sm truncate">
                {patient.lastName} {patient.firstName}
              </h3>
              <Badge 
                variant="outline" 
                className={`${getPriorityColor(patient.priorityScore)} text-white border-0`}
              >
                {getPriorityLabel(patient.priorityScore)}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <span>{patient.company}</span>
              <span>•</span>
              <span>ID: {patient.id}</span>
              {patient.legalDeadline && (
                <>
                  <span>•</span>
                  <span className="text-red-600 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Échéance: {patient.legalDeadline}
                  </span>
                </>
              )}
            </div>

            {/* AI Summary - 3 key points */}
            {patient.aiSummary && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-3">
                <h4 className="text-xs font-semibold text-blue-800 dark:text-blue-200 mb-1">
                  Résumé IA - Points Clés:
                </h4>
                <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  {patient.aiSummary.split('•').filter(point => point.trim()).map((point, index) => (
                    <div key={index} className="flex items-start gap-1">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>{point.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Decision Buttons */}
            {patient.quickConsultationMode && (
              <div className="flex gap-2 mb-2">
                {quickDecisions.map((decision) => (
                  <Button
                    key={decision.id}
                    variant="outline"
                    size="sm"
                    onClick={() => onQuickDecision(patient.id, decision.id)}
                    className="text-xs px-2 py-1 h-auto"
                  >
                    <decision.icon className="h-3 w-3 mr-1" />
                    {decision.label}
                  </Button>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>Examens: {patient.completedLabExams?.length || 0}</span>
              <span>Attente: {patient.waitTime || 0}min</span>
              {patient.serviceHistory && (
                <span>Historique: {patient.serviceHistory.length}</span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <Button 
              variant={patient.priorityScore && patient.priorityScore >= 80 ? "default" : "outline"}
              size="sm"
              onClick={() => onViewPatient(patient.id)}
              className={patient.priorityScore && patient.priorityScore >= 80 ? "bg-red-600 hover:bg-red-700" : ""}
            >
              <Eye className="h-4 w-4 mr-1" />
              {patient.quickConsultationMode ? 'Détail' : 'Voir'}
            </Button>
            
            {!patient.quickConsultationMode && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onViewPatient(patient.id)}
              >
                <Stethoscope className="h-4 w-4 mr-1" />
                Rapide
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriorityPatientCard;
