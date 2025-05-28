
import React from 'react';
import { usePatientStore } from '@/stores/usePatientStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import BackButton from '@/components/shared/BackButton';

const ExamHistory = () => {
  const { t } = useLanguage();
  const patients = usePatientStore(state => state.patients);

  // Récupérer tous les examens complétés
  const completedExams = patients.reduce((acc, patient) => {
    if (patient.completedLabExams && patient.completedLabExams.length > 0) {
      patient.completedLabExams.forEach(exam => {
        acc.push({
          ...exam,
          patientName: patient.name,
          patientId: patient.id,
          service: patient.service
        });
      });
    }
    return acc;
  }, [] as any[]);

  // Trier par date de completion (plus récent en premier)
  const sortedExams = completedExams.sort((a, b) => 
    new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('examHistory')}</h1>
        <BackButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('completedExams')}</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedExams.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {t('noExamsCompleted')}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs font-medium text-muted-foreground border-b">
                    <th className="px-4 py-3 text-left">{t('patient')}</th>
                    <th className="px-4 py-3 text-left">{t('examType')}</th>
                    <th className="px-4 py-3 text-left">{t('service')}</th>
                    <th className="px-4 py-3 text-left">{t('completedBy')}</th>
                    <th className="px-4 py-3 text-left">{t('completedAt')}</th>
                    <th className="px-4 py-3 text-left">{t('results')}</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedExams.map((exam, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium">{exam.patientName}</div>
                          <div className="text-xs text-muted-foreground">{exam.patientId}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{t(exam.type)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          exam.service === "VM" 
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" 
                            : exam.service === "Ug" 
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" 
                            : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        }`}>
                          {exam.service}
                        </span>
                      </td>
                      <td className="px-4 py-3">{exam.completedBy?.name}</td>
                      <td className="px-4 py-3">
                        {format(new Date(exam.completedAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="max-w-xs truncate" title={exam.results}>
                          {exam.results || t('noResults')}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamHistory;
