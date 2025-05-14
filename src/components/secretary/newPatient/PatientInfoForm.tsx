
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PatientInfoFormProps {
  formData: {
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
    idNumber: string;
    phone: string;
    email: string;
    address: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const PatientInfoForm: React.FC<PatientInfoFormProps> = ({
  formData,
  handleInputChange,
  handleSelectChange
}) => {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom <span className="text-red-500">*</span></Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Nom du patient"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom <span className="text-red-500">*</span></Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="Prénom du patient"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="birthDate">Date de naissance <span className="text-red-500">*</span></Label>
          <Input
            id="birthDate"
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="gender">Genre <span className="text-red-500">*</span></Label>
          <select 
            id="gender"
            name="gender"
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            value={formData.gender}
            onChange={(e) => handleSelectChange('gender', e.target.value)}
          >
            <option value="">Sélectionner le genre</option>
            <option value="M">Masculin</option>
            <option value="F">Féminin</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="idNumber">Numéro d'identité</Label>
          <Input
            id="idNumber"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleInputChange}
            placeholder="Numéro de carte d'identité"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Numéro de téléphone"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Adresse email"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Adresse</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Adresse du patient"
          />
        </div>
      </div>
    </form>
  );
};

export default PatientInfoForm;
