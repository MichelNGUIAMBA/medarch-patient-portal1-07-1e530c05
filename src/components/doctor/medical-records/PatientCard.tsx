
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Eye, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Patient } from '@/types/patient';

interface PatientCardProps {
  patient: Patient & { aiSummary?: string; aiStatus?: string };
  onViewPatient: (patientId: string) => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onViewPatient }) => {
  const getServiceBadge = (serviceType: "VM" | "Cons" | "Ug") => {
    switch (serviceType) {
      case "VM":
        return <Badge className="bg-blue-500 text-white">✅ VM</Badge>;
      case "Cons":
        return <Badge className="bg-yellow-500 text-white">⚠️ Cons</Badge>;
      case "Ug":
        return <Badge className="bg-red-500 text-white">🚨 Ug</Badge>;
    }
  };

  const getAIStatusIcon = (status?: string) => {
    switch (status) {
      case 'to_review':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'normal':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'potential_emergency':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Avatar className="h-12 w-12">
            <AvatarImage src={`/api/placeholder/48/48`} alt={patient.name} />
            <AvatarFallback>{getInitials(patient.firstName, patient.lastName)}</AvatarFallback>
          </Avatar>

          {/* Patient Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm truncate">
                {patient.lastName} {patient.firstName}
              </h3>
              {getAIStatusIcon(patient.aiStatus)}
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">{patient.company}</p>
            
            <div className="flex flex-wrap gap-1 mb-2">
              {getServiceBadge(patient.service)}
              <Badge variant="outline" className="text-xs">
                ID: {patient.id}
              </Badge>
            </div>

            {/* AI Summary */}
            {patient.aiSummary && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-xs text-blue-800 dark:text-blue-200 mb-2">
                <strong>Résumé IA:</strong> {patient.aiSummary}
              </div>
            )}

            {/* Stats */}
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>Examens: {patient.completedLabExams?.length || 0}</span>
              <span>Services: {patient.serviceHistory?.length || 0}</span>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewPatient(patient.id)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Voir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientCard;
