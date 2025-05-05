import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, differenceInYears } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePatientStore } from '@/stores/usePatientStore';
import { useAuth } from '@/hooks/use-auth-context';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { Pencil } from 'lucide-react';
import BackButton from '@/components/shared/BackButton';

const PatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const patients = usePatientStore((state) => state.patients);
  const updatePatient = usePatientStore((state) => state.updatePatient);
  const { user } = useAuth();
  
  const patient = patients.find(p => p.id === id);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    idNumber: '',
    phone: '',
    email: '',
    address: '',
    company: '',
    employeeId: '',
    service: ''
  });
  
  if (!patient) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Patient non trouvé</h1>
        <BackButton />
      </div>
    );
  }

  const calculateAge = (birthDate: string) => {
    return differenceInYears(new Date(), new Date(birthDate));
  };
  
  const handleOpenEditDialog = () => {
    setEditForm({
      firstName: patient.firstName,
      lastName: patient.lastName,
      birthDate: patient.birthDate,
      gender: patient.gender,
      idNumber: patient.idNumber || '',
      phone: patient.phone || '',
      email: patient.email || '',
      address: patient.address || '',
      company: patient.company,
      employeeId: patient.employeeId || '',
      service: patient.service
    });
    setIsDialogOpen(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (field: string, value: string) => {
    setEditForm(prev => ({
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
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        birthDate: editForm.birthDate,
        gender: editForm.gender,
        idNumber: editForm.idNumber || undefined,
        phone: editForm.phone || undefined,
        email: editForm.email || undefined,
        address: editForm.address || undefined,
        company: editForm.company,
        employeeId: editForm.employeeId || undefined,
        service: editForm.service as "VM" | "Cons" | "Ug"
      },
      { name: user.name, role: user.role }
    );
    
    toast.success("Informations du patient mises à jour");
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-2xl font-bold">Détails du patient</h1>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={handleOpenEditDialog}
            className="flex items-center gap-1"
          >
            <Pencil className="h-4 w-4" />
            Modifier
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Nom complet</p>
              <p className="font-medium">{patient.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Âge</p>
              <p className="font-medium">{calculateAge(patient.birthDate)} ans</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Genre</p>
              <p className="font-medium">{patient.gender === 'M' ? 'Masculin' : 'Féminin'}</p>
            </div>
            {patient.idNumber && (
              <div>
                <p className="text-sm text-gray-500">Numéro d'identité</p>
                <p className="font-medium">{patient.idNumber}</p>
              </div>
            )}
            {patient.phone && (
              <div>
                <p className="text-sm text-gray-500">Téléphone</p>
                <p className="font-medium">{patient.phone}</p>
              </div>
            )}
            {patient.email && (
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{patient.email}</p>
              </div>
            )}
            {patient.address && (
              <div>
                <p className="text-sm text-gray-500">Adresse</p>
                <p className="font-medium">{patient.address}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations de consultation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Entreprise</p>
              <p className="font-medium">{patient.company}</p>
            </div>
            {patient.employeeId && (
              <div>
                <p className="text-sm text-gray-500">Numéro d'employé</p>
                <p className="font-medium">{patient.employeeId}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Service demandé</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                patient.service === "VM" 
                  ? "bg-blue-100 text-blue-800"
                  : patient.service === "Ug"
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
              }`}>
                {patient.service}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Statut</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                patient.status === "En cours" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-yellow-100 text-yellow-800"
              }`}>
                {patient.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date et heure d'enregistrement</p>
              <p className="font-medium">
                {format(new Date(patient.registeredAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Historique des modifications */}
      {patient.modificationHistory && patient.modificationHistory.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Historique des modifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Champ</th>
                    <th className="text-left py-2 px-4">Ancienne valeur</th>
                    <th className="text-left py-2 px-4">Nouvelle valeur</th>
                    <th className="text-left py-2 px-4">Modifié par</th>
                    <th className="text-left py-2 px-4">Date et heure</th>
                  </tr>
                </thead>
                <tbody>
                  {patient.modificationHistory.map((record, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{record.field}</td>
                      <td className="py-2 px-4">{record.oldValue}</td>
                      <td className="py-2 px-4">{record.newValue}</td>
                      <td className="py-2 px-4">
                        {record.modifiedBy.name} ({record.modifiedBy.role})
                      </td>
                      <td className="py-2 px-4">
                        {format(new Date(record.timestamp), "d MMM yyyy HH:mm", { locale: fr })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog for editing patient information */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSaveChanges}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientDetails;
