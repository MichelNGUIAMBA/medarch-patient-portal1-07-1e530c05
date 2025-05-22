
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, FileEdit, Eye, History } from 'lucide-react';
import { Patient } from '@/types/patient';
import ModificationHistory from '@/components/nurse/ModificationHistory';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';

interface EmergencyPatientsTableProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onCompleteEdit: (patient: Patient) => void;
}

const EmergencyPatientsTable = ({ 
  patients, 
  onEdit, 
  onCompleteEdit 
}: EmergencyPatientsTableProps) => {
  const navigate = useNavigate();
  const [showHistory, setShowHistory] = useState<string | null>(null);
  const { t } = useLanguage();
  
  const handleViewDetails = (patient: Patient) => {
    navigate(`/dashboard/secretary/patient/${patient.id}`);
  };
  
  const toggleHistory = (patientId: string) => {
    if (showHistory === patientId) {
      setShowHistory(null);
    } else {
      setShowHistory(patientId);
    }
  };

  if (patients.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            {t('noEmergenciesTreated')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('patientsReceivedEmergencyTreatment')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-medium text-gray-500 bg-gray-50 border-b">
                <th className="px-4 py-2 text-left">{t('id')}</th>
                <th className="px-4 py-2 text-left">{t('name')}</th>
                <th className="px-4 py-2 text-left">{t('company')}</th>
                <th className="px-4 py-2 text-left">{t('takenCareBy')}</th>
                <th className="px-4 py-2 text-left">{t('status')}</th>
                <th className="px-4 py-2 text-left">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient: Patient) => (
                <React.Fragment key={patient.id}>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{patient.id}</td>
                    <td className="px-4 py-2">{patient.name}</td>
                    <td className="px-4 py-2">{patient.company}</td>
                    <td className="px-4 py-2">{patient.takenCareBy?.name}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        patient.status === "Terminé" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => onEdit(patient)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          {t('simpleModification')}
                        </Button>
                        <Button
                          variant="default"
                          size="sm" 
                          onClick={() => onCompleteEdit(patient)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <FileEdit className="h-4 w-4 mr-1" />
                          {t('completeModification')}
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleViewDetails(patient)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          {t('show')}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleHistory(patient.id)}
                        >
                          <History className="h-4 w-4 mr-1" />
                          {showHistory === patient.id ? t('hide') : t('history')}
                        </Button>
                      </div>
                    </td>
                  </tr>
                  {showHistory === patient.id && (
                    <tr>
                      <td colSpan={6} className="p-0">
                        <div className="p-4 bg-gray-50">
                          <ModificationHistory patient={patient} />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyPatientsTable;
