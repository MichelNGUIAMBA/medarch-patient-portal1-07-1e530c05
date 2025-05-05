
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, differenceInYears } from 'date-fns';
import { ChevronLeft, Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePatientStore } from '@/stores/usePatientStore';
import { useDailyActivityStore } from '@/stores/useDailyActivityStore';
import { useAuth } from '@/hooks/use-auth-context';
import { useLanguage } from '@/hooks/useLanguage';
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

const NewDay = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const patients = usePatientStore(state => state.patients);
  const resetPatientStatuses = usePatientStore(state => state.resetPatientStatuses);
  const assignServiceForDay = usePatientStore(state => state.assignServiceForDay);
  const addActivity = useDailyActivityStore(state => state.addActivity);
  
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedService, setSelectedService] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const calculateAge = (birthDate) => {
    return differenceInYears(new Date(), new Date(birthDate));
  };

  const handleOpenServiceDialog = (patient) => {
    setSelectedPatient(patient);
    setSelectedService("");
    setIsDialogOpen(true);
  };

  const handleResetDay = () => {
    if (!user) return;
    
    resetPatientStatuses();
    
    addActivity({
      type: 'status_change',
      description: t('dayReset'),
      timestamp: new Date().toISOString(),
      performedBy: {
        name: user.name,
        role: user.role
      }
    });
    
    toast.success(t('dayResetSuccess'), {
      description: t('patientsStatusesReset')
    });
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
      description: `${t('patientAssignedToService')} ${selectedService}`,
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
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="mr-4 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            onClick={() => navigate('/dashboard')}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            {t('backToDashboard')}
          </Button>
          <h1 className="text-2xl font-bold">{t('newDay')}</h1>
        </div>
        
        <Button 
          variant="outline" 
          onClick={handleResetDay}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30"
        >
          <Calendar className="h-4 w-4" />
          {t('resetDayStatuses')}
        </Button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold flex items-center dark:text-white">
            <Calendar className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            <span>{t('assignPatientsForToday')}</span>
            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
              {format(new Date(), 'EEEE d MMMM yyyy')}
            </span>
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('patientId')}</TableHead>
                <TableHead>{t('name')}</TableHead>
                <TableHead>{t('age')}</TableHead>
                <TableHead>{t('company')}</TableHead>
                <TableHead>{t('lastService')}</TableHead>
                <TableHead>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <TableRow key={patient.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <TableCell className="whitespace-nowrap dark:text-gray-200">{patient.id}</TableCell>
                    <TableCell className="font-medium uppercase whitespace-nowrap dark:text-gray-200">{patient.name}</TableCell>
                    <TableCell className="whitespace-nowrap dark:text-gray-200">
                      {calculateAge(patient.birthDate)} {t('years')}
                    </TableCell>
                    <TableCell className="whitespace-nowrap dark:text-gray-200">{patient.company}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {patient.service && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          patient.service === "VM" 
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            : patient.service === "Ug"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        }`}>
                          {patient.service}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30"
                        onClick={() => handleOpenServiceDialog(patient)}
                      >
                        <Plus className="h-3 w-3" />
                        {t('assignService')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-500 dark:text-gray-400">
                    {t('noPatientsInSystem')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
            <Select value={selectedService} onValueChange={(value) => setSelectedService(value)}>
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
    </div>
  );
};

export default NewDay;
