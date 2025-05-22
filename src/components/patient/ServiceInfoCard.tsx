import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Patient } from '@/types/patient';
import { useLanguage } from '@/hooks/useLanguage';
import { getServiceColor } from './utils/patientDetailUtils';
interface ServiceInfoCardProps {
  patient: Patient;
}
const ServiceInfoCard = ({
  patient
}: ServiceInfoCardProps) => {
  const {
    t
  } = useLanguage();
  return;
};
export default ServiceInfoCard;