
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePatientStore } from "@/stores/usePatientStore";
import { Patient } from "@/types/patient";
import { Search, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth-context";
import { toast } from "@/components/ui/sonner";
import { useLanguage } from "@/hooks/useLanguage";
import ExistingPatientDialog from "./ExistingPatientDialog";

interface ExistingPatientSearchProps {
  onAdd?: (patient: Patient) => void;
  onPatientSelect?: (patient: Patient) => void;
}

const ExistingPatientSearch: React.FC<ExistingPatientSearchProps> = ({ onAdd, onPatientSelect }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const patients = usePatientStore((state) => state.patients);
  const addServiceToExistingPatient = usePatientStore((state) => state.addServiceToExistingPatient);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<"VM" | "Cons" | "Ug" | "">("");

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    // Filtre les patients par nom, prénom, ID ou ID d'employé
    const results = patients.filter((p) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        p.name?.toLowerCase().includes(searchLower) ||
        p.firstName?.toLowerCase().includes(searchLower) ||
        p.lastName?.toLowerCase().includes(searchLower) ||
        p.id?.toLowerCase().includes(searchLower) ||
        p.employeeId?.toLowerCase().includes(searchLower)
      );
    });
    
    // Pour l'assignation d'un nouveau service, on montre seulement les patients "uniques"
    // (ceux qui n'ont pas de référence à un patient original)
    const uniquePatients = results.filter(p => !p.originalPatientId);
    
    setSearchResults(uniquePatients);
  };

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
    if (onPatientSelect) {
      onPatientSelect(patient);
    } else {
      setIsDialogOpen(true);
    }
  };

  const handleServiceChange = (value: string) => {
    setSelectedService(value as "VM" | "Cons" | "Ug");
  };

  const handleAddPatientWithService = () => {
    if (!selectedPatient) return;
    if (!selectedService) {
      toast.error(t('selectService'));
      return;
    }

    if (!user) {
      toast.error(t('mustBeLoggedIn'));
      return;
    }

    // Créer une nouvelle visite pour le patient existant
    addServiceToExistingPatient(selectedPatient.id, selectedService);
    
    toast.success(t('patientAddedToQueue'));
    
    setIsConfirmDialogOpen(false);
    setSelectedPatient(null);
    setSelectedService("");
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleOpenConfirmDialog = () => {
    setIsDialogOpen(false);
    setIsConfirmDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('searchByNameOrId')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
        </div>
        <Button onClick={handleSearch}>{t('search')}</Button>
      </div>

      {searchResults.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-2">{t('id')}</th>
                <th className="text-left p-2">{t('name')}</th>
                <th className="text-left p-2">{t('company')}</th>
                <th className="text-left p-2">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((patient) => (
                <tr key={patient.id} className="border-t hover:bg-muted/30">
                  <td className="p-2">{patient.id}</td>
                  <td className="p-2">{patient.name}</td>
                  <td className="p-2">{patient.company}</td>
                  <td className="p-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePatientClick(patient)}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      {t('selectPatient')}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : searchTerm ? (
        <p className="text-center py-2 text-muted-foreground">
          {t('noResultsFound')}
        </p>
      ) : null}

      {selectedPatient && !onPatientSelect && (
        <>
          <ExistingPatientDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            patient={selectedPatient}
            onAddService={handleOpenConfirmDialog}
          />
          
          <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('addToServiceQueue')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid gap-2">
                  <p>{t('name')}: {selectedPatient.name}</p>
                  <p>{t('company')}: {selectedPatient.company}</p>
                  <p>{t('id')}: {selectedPatient.id}</p>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="service" className="text-sm font-medium">
                    {t('selectServiceType')}:
                  </label>
                  <Select value={selectedService} onValueChange={handleServiceChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('chooseService')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VM">{t('VM')}</SelectItem>
                      <SelectItem value="Cons">{t('Cons')}</SelectItem>
                      <SelectItem value="Ug">{t('Ug')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
                  {t('cancel')}
                </Button>
                <Button onClick={handleAddPatientWithService}>{t('add')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default ExistingPatientSearch;
