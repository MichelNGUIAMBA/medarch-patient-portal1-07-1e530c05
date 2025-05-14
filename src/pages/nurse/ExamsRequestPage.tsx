
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClipboardCheck, FileText, ActivitySquare, Microscope } from 'lucide-react';
import BackButton from '@/components/shared/BackButton';
import { useLanguage } from '@/hooks/useLanguage';
import LabExamForm from '@/components/exams/LabExamForm';
import BloodPressureForm from '@/components/exams/BloodPressureForm';
import GlycemiaForm from '@/components/exams/GlycemiaForm';
import ExamPrescriptionForm from '@/components/exams/ExamPrescriptionForm';

const ExamsRequestPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("lab-exam");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('exams')}</h1>
        <BackButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('requestExams')}</CardTitle>
          <CardDescription>
            {t('selectExamTypeAndPatient')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="lab-exam" className="flex items-center gap-2">
                <Microscope className="h-4 w-4" />
                <span>Exam Labo (EL)</span>
              </TabsTrigger>
              <TabsTrigger value="blood-pressure" className="flex items-center gap-2">
                <ActivitySquare className="h-4 w-4" />
                <span>Fiche TA (TA)</span>
              </TabsTrigger>
              <TabsTrigger value="glycemia" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Glycémie (GL)</span>
              </TabsTrigger>
              <TabsTrigger value="exam-prescription" className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4" />
                <span>Prescription d'Examen (PE)</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="lab-exam">
              <LabExamForm />
            </TabsContent>
            
            <TabsContent value="blood-pressure">
              <BloodPressureForm />
            </TabsContent>
            
            <TabsContent value="glycemia">
              <GlycemiaForm />
            </TabsContent>
            
            <TabsContent value="exam-prescription">
              <ExamPrescriptionForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamsRequestPage;
