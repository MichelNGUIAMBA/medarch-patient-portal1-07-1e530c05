
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Patient } from '@/types/patient';
import { useLanguage } from '@/hooks/useLanguage';

interface PatientInfoCardProps {
  patient: Patient | null;
}

const PatientInfoCard = ({ patient }: PatientInfoCardProps) => {
  const { t } = useLanguage();
  
  if (!patient) {
    return (
      <Card className="w-full mb-6">
        <CardHeader>
          <CardTitle className="text-lg">{t('patientInfo')}</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-muted-foreground">{t('patientNotFound')}</p>
        </CardContent>
      </Card>
    );
  }

  // Determine le type de service
  const getServiceDisplay = () => {
    switch(patient.service) {
      case "Ug":
        return {
          text: t('emergency') + " (Ug)",
          className: "text-red-600"
        };
      case "Cons":
        return {
          text: t('consultation') + " (Cons)",
          className: "text-green-600"
        };
      case "VM":
        return {
          text: t('medicalVisit') + " (VM)",
          className: "text-blue-600"
        };
      default:
        return {
          text: patient.service,
          className: ""
        };
    }
  };
  
  const serviceDisplay = getServiceDisplay();

  return (
    <Card className="w-full mb-6">
      <CardHeader className="">
        <CardTitle className="text-lg">{t('patientInfo')}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t('id')}</p>
            <p>{patient.id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t('name')}</p>
            <p>{patient.lastName} {patient.firstName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t('birthDate')}</p>
            <p>{new Date(patient.birthDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t('gender')}</p>
            <p>{patient.gender === 'M' ? t('male') : t('female')}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t('company')}</p>
            <p>{patient.company}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t('service')}</p>
            <p className={`font-medium ${serviceDisplay.className}`}>
              {serviceDisplay.text}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientInfoCard;
