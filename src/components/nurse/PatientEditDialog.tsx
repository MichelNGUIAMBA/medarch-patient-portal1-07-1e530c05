
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePatientStore } from '@/stores/usePatientStore';
import { Patient } from '@/types/patient';
import { useAuth } from '@/hooks/use-auth-context';
import { toast } from '@/components/ui/sonner';
import { useNurseAccessControl } from '@/hooks/useNurseAccessControl';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock } from 'lucide-react';

interface PatientEditDialogProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
}

const PatientEditDialog = ({ patient, isOpen, onClose }: PatientEditDialogProps) => {
  const { user } = useAuth();
  const updatePatient = usePatientStore(state => state.updatePatient);
  const { canModifyPatient, getAccessMessage } = useNurseAccessControl();
  
  const [formData, setFormData] = useState({
    firstName: patient?.firstName || '',
    lastName: patient?.lastName || '',
    notes: patient?.notes || '',
    status: patient?.status || 'En attente'
  });
  
  // Update form data when patient changes
  React.useEffect(() => {
    if (patient) {
      setFormData({
        firstName: patient.firstName,
        lastName: patient.lastName,
        notes: patient.notes || '',
        status: patient.status
      });
    }
  }, [patient]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSaveChanges = () => {
    if (!user) {
      toast.error("Vous devez être connecté pour modifier un patient");
      return;
    }
    
    if (!patient) {
      toast.error("Aucun patient sélectionné");
      return;
    }
    
    if (!canModifyPatient(patient)) {
      toast.error("Vous n'avez pas l'autorisation de modifier ce patient");
      return;
    }
    
    updatePatient(
      patient.id,
      {
        firstName: formData.firstName,
        lastName: formData.lastName,
        notes: formData.notes,
        status: formData.status as "En attente" | "En cours" | "Terminé"
      },
      { name: user.name, role: user.role }
    );
    
    toast.success("Informations du patient mises à jour");
    onClose();
  };
  
  // Don't render if no patient is selected
  if (!patient) {
    return null;
  }
  
  const canEdit = canModifyPatient(patient);
  const accessMessage = getAccessMessage(patient);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {canEdit ? 'Modifier les informations du patient' : 'Consulter les informations du patient'}
          </DialogTitle>
        </DialogHeader>
        
        {!canEdit && accessMessage && (
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertDescription>{accessMessage}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!canEdit}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!canEdit}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes médicales</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Observations, traitements, recommandations..."
              className="min-h-[100px]"
              disabled={!canEdit}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange('status', value)}
              disabled={!canEdit}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Sélectionnez" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="En attente">En attente</SelectItem>
                <SelectItem value="En cours">En cours</SelectItem>
                <SelectItem value="Terminé">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {canEdit ? 'Annuler' : 'Fermer'}
          </Button>
          {canEdit && (
            <Button onClick={handleSaveChanges}>Enregistrer</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PatientEditDialog;
