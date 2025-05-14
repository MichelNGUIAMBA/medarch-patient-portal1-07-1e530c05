
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import ExistingPatientDialog from '@/components/secretary/ExistingPatientDialog';
import BackButton from '@/components/shared/BackButton';
import NewPatientForm from '@/components/secretary/newPatient/NewPatientForm';

const NewPatient = () => {
  const [activeTab, setActiveTab] = useState<string>('manual');
  const [existingPatientDialogOpen, setExistingPatientDialogOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-2xl font-bold">Enregistrement d'un nouveau patient</h1>
        </div>
        <Button 
          onClick={() => setExistingPatientDialogOpen(true)} 
          variant="outline"
          className="flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Patient existant
        </Button>
      </div>
      
      <NewPatientForm
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <ExistingPatientDialog 
        open={existingPatientDialogOpen}
        onOpenChange={setExistingPatientDialogOpen}
      />
    </div>
  );
};

export default NewPatient;
