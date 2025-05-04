
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Patient } from '@/types/patient';
import { usePatientStore } from '@/stores/usePatientStore';
import { useAuth } from '@/hooks/use-auth-context';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { useDailyActivityStore } from '@/stores/useDailyActivityStore';
import { useLanguage } from '@/hooks/useLanguage';

interface PatientsTableProps {
  patients: Patient[];
}

const PatientsTable = ({ patients }: PatientsTableProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const assignServiceForDay = usePatientStore(state => state.assignServiceForDay);
  const addActivity = useDailyActivityStore(state => state.addActivity);
  
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedService, setSelectedService] = useState<"VM" | "Cons" | "Ug" | "">("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenServiceDialog = (patient: Patient) => {
    setSelectedPatient(patient);
    setSelectedService("");
    setIsDialogOpen(true);
  };

  const handleAssignService = () => {
    if (!selectedPatient || !selectedService || !user) return;
    
    assignServiceForDay(
      selectedPatient.id,
      selectedService,
      { name: user.name, role: user.role }
    );
    
    // Add activity to daily log
    addActivity({
      type: 'service_assignment',
      description: `Patient assigné au service ${selectedService}`,
      timestamp: new Date().toISOString(),
      performedBy: {
        name: user.name,
        role: user.role
      },
      patientId: selectedPatient.id,
      patientName: selectedPatient.name
    });
    
    // Close dialog and show toast confirmation
    setIsDialogOpen(false);
    toast.success(t('patientAssignedToService'), {
      description: `${selectedPatient.name} ${t('assignedTo')} ${selectedService}`
    });
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold flex items-center dark:text-white">
            <ClipboardCheck className="h-5 w-5 mr-2" />
            {t('lastRegisteredPatients')}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-medium text-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 border-b dark:border-gray-600">
                <th className="px-6 py-3 text-left">{t('patientId')}</th>
                <th className="px-6 py-3 text-left">{t('name')}</th>
                <th className="px-6 py-3 text-left">{t('company')}</th>
                <th className="px-6 py-3 text-left">{t('service')}</th>
                <th className="px-6 py-3 text-left">{t('status')}</th>
                <th className="px-6 py-3 text-left">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap dark:text-gray-200">{patient.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium uppercase dark:text-gray-200">{patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap dark:text-gray-200">{patient.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {patient.service ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        patient.service === "VM" 
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          : patient.service === "Ug"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      }`}>
                        {patient.service}
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 dark:text-green-400 flex items-center gap-1"
                        onClick={() => handleOpenServiceDialog(patient)}
                      >
                        <Plus className="h-3 w-3" />
                        {t('newService')}
                      </Button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {patient.status ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        patient.status === "En cours" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                          : patient.status === "Terminé"
                          ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}>
                        {patient.status}
                      </span>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">{t('noStatus')}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 dark:hover:text-blue-300"
                      onClick={() => navigate(`/dashboard/patient/${patient.id}`)}
                    >
                      {t('show')}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t('assignService')} - {selectedPatient?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Select value={selectedService} onValueChange={(value: "VM" | "Cons" | "Ug") => setSelectedService(value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('selectService')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VM">{t('medicalVisit')}</SelectItem>
                <SelectItem value="Cons">{t('consultation')}</SelectItem>
                <SelectItem value="Ug">{t('emergency')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button 
              disabled={!selectedService}
              onClick={handleAssignService}
            >
              {t('confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PatientsTable;
