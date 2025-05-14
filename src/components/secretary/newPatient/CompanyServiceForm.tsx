
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CompanyServiceFormProps {
  formData: {
    company: string;
    employeeId: string;
    selectedService: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleServiceChange: (service: string) => void;
  availableServices: {
    vm: boolean;
    cons: boolean;
    urg: boolean;
  };
}

const CompanyServiceForm: React.FC<CompanyServiceFormProps> = ({
  formData,
  handleInputChange,
  handleSelectChange,
  handleServiceChange,
  availableServices
}) => {
  return (
    <form className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company">Entreprise <span className="text-red-500">*</span></Label>
          <Select 
            onValueChange={(value) => handleSelectChange('company', value)} 
            value={formData.company}
          >
            <SelectTrigger id="company">
              <SelectValue placeholder="Sélectionner l'entreprise" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Entreprises principales</SelectLabel>
                <SelectItem value="PERENCO">PERENCO</SelectItem>
                <SelectItem value="Total SA">Total SA</SelectItem>
                <SelectItem value="Dixstone">Dixstone</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Autres</SelectLabel>
                <SelectItem value="Autre">Autre société</SelectItem>
                <SelectItem value="Stagiaire">Stagiaire</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="employeeId">Numéro d'employé</Label>
          <Input
            id="employeeId"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleInputChange}
            placeholder="Numéro d'employé (si applicable)"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Service requis <span className="text-red-500">*</span></Label>
          <Card className="p-4 border-dashed">
            <div className="space-y-4">
              <RadioGroup 
                value={formData.selectedService} 
                onValueChange={handleServiceChange}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    id="vm" 
                    value="VM"
                    disabled={!availableServices.vm}
                  />
                  <Label 
                    htmlFor="vm" 
                    className={!availableServices.vm ? "text-gray-400" : ""}
                  >
                    Visite Médicale (VM)
                    {!availableServices.vm && 
                      <span className="ml-2 text-xs text-red-500">
                        Non disponible pour cette entreprise
                      </span>
                    }
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    id="cons" 
                    value="Cons"
                    disabled={!availableServices.cons}
                  />
                  <Label
                    htmlFor="cons"
                    className={!availableServices.cons ? "text-gray-400" : ""}
                  >
                    Consultation (Cons)
                    {!availableServices.cons && 
                      <span className="ml-2 text-xs text-red-500">
                        Non disponible pour cette entreprise
                      </span>
                    }
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    id="urg" 
                    value="Ug"
                    disabled={!availableServices.urg}
                  />
                  <Label 
                    htmlFor="urg"
                    className={!availableServices.urg ? "text-gray-400" : ""}
                  >
                    Urgence (Urg)
                    {!availableServices.urg && 
                      <span className="ml-2 text-xs text-red-500">
                        Non disponible pour cette entreprise
                      </span>
                    }
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </Card>
          <p className="text-sm text-muted-foreground mt-2">
            Note: Les services disponibles varient selon l'entreprise
          </p>
        </div>
      </div>
    </form>
  );
};

export default CompanyServiceForm;
