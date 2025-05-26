
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, UserCheck, Building, AlertTriangle, Calendar, Pill } from 'lucide-react';

interface StandardDecisionButtonsProps {
  onDecision: (decision: StandardDecision) => void;
  disabled?: boolean;
}

export interface StandardDecision {
  type: 'sick_leave' | 'specialist_referral' | 'follow_up' | 'urgent_care' | 'work_restriction' | 'medication_adjustment';
  title: string;
  description: string;
  duration?: string;
  specialty?: string;
}

const StandardDecisionButtons: React.FC<StandardDecisionButtonsProps> = ({
  onDecision,
  disabled = false
}) => {
  const { t } = useLanguage();

  const standardDecisions: StandardDecision[] = [
    {
      type: 'sick_leave',
      title: t('sickLeave'),
      description: t('sickLeaveDescription'),
      duration: '3-7 jours'
    },
    {
      type: 'specialist_referral',
      title: t('specialistReferral'),
      description: t('specialistReferralDescription'),
      specialty: 'À définir'
    },
    {
      type: 'follow_up',
      title: t('followUpAppointment'),
      description: t('followUpDescription'),
      duration: '1-2 semaines'
    },
    {
      type: 'urgent_care',
      title: t('urgentCare'),
      description: t('urgentCareDescription')
    },
    {
      type: 'work_restriction',
      title: t('workRestriction'),
      description: t('workRestrictionDescription'),
      duration: '1-4 semaines'
    },
    {
      type: 'medication_adjustment',
      title: t('medicationAdjustment'),
      description: t('medicationAdjustmentDescription')
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'sick_leave':
        return <FileText className="h-5 w-5" />;
      case 'specialist_referral':
        return <UserCheck className="h-5 w-5" />;
      case 'follow_up':
        return <Calendar className="h-5 w-5" />;
      case 'urgent_care':
        return <AlertTriangle className="h-5 w-5" />;
      case 'work_restriction':
        return <Building className="h-5 w-5" />;
      case 'medication_adjustment':
        return <Pill className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getButtonColor = (type: string) => {
    switch (type) {
      case 'urgent_care':
        return 'bg-red-500 hover:bg-red-600';
      case 'sick_leave':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'specialist_referral':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'work_restriction':
        return 'bg-yellow-500 hover:bg-yellow-600';
      default:
        return 'bg-green-500 hover:bg-green-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          {t('standardDecisions')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {standardDecisions.map((decision) => (
            <Button
              key={decision.type}
              variant="outline"
              className={`h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-md transition-all ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => !disabled && onDecision(decision)}
              disabled={disabled}
            >
              <div className="flex items-center gap-2 self-start">
                {getIcon(decision.type)}
                <span className="font-medium text-sm">{decision.title}</span>
              </div>
              <p className="text-xs text-muted-foreground text-left leading-relaxed">
                {decision.description}
              </p>
              {(decision.duration || decision.specialty) && (
                <div className="text-xs text-primary font-medium">
                  {decision.duration && `Durée: ${decision.duration}`}
                  {decision.specialty && `Spécialité: ${decision.specialty}`}
                </div>
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StandardDecisionButtons;
