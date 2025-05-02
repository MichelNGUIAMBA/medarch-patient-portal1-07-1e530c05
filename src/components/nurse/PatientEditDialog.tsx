
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

interface PatientEditDialogProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
}

const PatientEditDialog = ({ patient, isOpen, onClose }: PatientEditDialogProps) => {
  const { user } = useAuth();
  const updatePatient = usePatientStore(state => state.updatePatient);
  
  const [formData, setFormData] = useState({
    firstName: patient.firstName,
    lastName: patient.lastName,
    notes: patient.notes || '',
    status: patient.status
  });
  
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
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier les informations du patient</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
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
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange('status', value)}
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
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSaveChanges}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PatientEditDialog;
