
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PatientEditFormProps {
  isOpen: boolean;
  onClose: () => void;
  editForm: {
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
    idNumber: string;
    phone: string;
    email: string;
    address: string;
    company: string;
    employeeId: string;
    service: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (field: string, value: string) => void;
  handleSaveChanges: () => void;
}

const PatientEditDialog = ({
  isOpen,
  onClose,
  editForm,
  handleInputChange,
  handleSelectChange,
  handleSaveChanges
}: PatientEditFormProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier les informations du patient</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              name="firstName"
              value={editForm.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              name="lastName"
              value={editForm.lastName}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthDate">Date de naissance</Label>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              value={editForm.birthDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Genre</Label>
            <Select
              value={editForm.gender}
              onValueChange={(value) => handleSelectChange('gender', value)}
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="Sélectionnez" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Masculin</SelectItem>
                <SelectItem value="F">Féminin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="idNumber">Numéro d'identité</Label>
            <Input
              id="idNumber"
              name="idNumber"
              value={editForm.idNumber}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              name="phone"
              value={editForm.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={editForm.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              name="address"
              value={editForm.address}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Entreprise</Label>
            <Select
              value={editForm.company}
              onValueChange={(value) => handleSelectChange('company', value)}
            >
              <SelectTrigger id="company">
                <SelectValue placeholder="Sélectionnez" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERENCO">PERENCO</SelectItem>
                <SelectItem value="Total SA">Total SA</SelectItem>
                <SelectItem value="Dixstone">Dixstone</SelectItem>
                <SelectItem value="Autre">Autre société</SelectItem>
                <SelectItem value="Stagiaire">Stagiaire</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="employeeId">Numéro d'employé</Label>
            <Input
              id="employeeId"
              name="employeeId"
              value={editForm.employeeId}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="service">Service</Label>
            <Select
              value={editForm.service}
              onValueChange={(value) => handleSelectChange('service', value)}
            >
              <SelectTrigger id="service">
                <SelectValue placeholder="Sélectionnez" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VM">Visite Médicale (VM)</SelectItem>
                <SelectItem value="Cons">Consultation (Cons)</SelectItem>
                <SelectItem value="Ug">Urgence (Ug)</SelectItem>
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
