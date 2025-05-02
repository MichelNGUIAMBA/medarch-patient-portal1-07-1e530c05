
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface StepTreatmentProps {
  formData: {
    immediateActions: string;
    medications: string;
    procedures: string;
    responseToTreatment: string;
    furtherActions: string;
    referralToSpecialist: boolean;
    hospitalization: boolean;
    monitoringRequired: boolean;
    notes: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (field: string, checked: boolean) => void;
}

const StepTreatment = ({ 
  formData, 
  handleInputChange, 
  handleCheckboxChange 
}: StepTreatmentProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="immediateActions" className="font-medium">
          Actions immédiates effectuées <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="immediateActions"
          name="immediateActions"
          value={formData.immediateActions}
          onChange={handleInputChange}
          placeholder="Actions réalisées immédiatement à l'arrivée du patient..."
          rows={3}
          className="resize-none"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="medications" className="font-medium">
          Médicaments administrés
        </Label>
        <Textarea
          id="medications"
          name="medications"
          value={formData.medications}
          onChange={handleInputChange}
          placeholder="Liste des médicaments, doses et heures d'administration..."
          rows={3}
          className="resize-none"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="procedures" className="font-medium">
          Procédures réalisées
        </Label>
        <Textarea
          id="procedures"
          name="procedures"
          value={formData.procedures}
          onChange={handleInputChange}
          placeholder="Détails des procédures médicales effectuées..."
          rows={3}
          className="resize-none"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="responseToTreatment" className="font-medium">
          Réponse au traitement <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="responseToTreatment"
          name="responseToTreatment"
          value={formData.responseToTreatment}
          onChange={handleInputChange}
          placeholder="Comment le patient a-t-il répondu aux traitements..."
          rows={2}
          className="resize-none"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="referralToSpecialist"
            checked={formData.referralToSpecialist}
            onCheckedChange={(checked) => handleCheckboxChange('referralToSpecialist', checked as boolean)}
          />
          <Label htmlFor="referralToSpecialist" className="text-sm font-medium">
            Référence à un spécialiste
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="hospitalization"
            checked={formData.hospitalization}
            onCheckedChange={(checked) => handleCheckboxChange('hospitalization', checked as boolean)}
          />
          <Label htmlFor="hospitalization" className="text-sm font-medium">
            Hospitalisation requise
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="monitoringRequired"
            checked={formData.monitoringRequired}
            onCheckedChange={(checked) => handleCheckboxChange('monitoringRequired', checked as boolean)}
          />
          <Label htmlFor="monitoringRequired" className="text-sm font-medium">
            Surveillance continue
          </Label>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="furtherActions" className="font-medium">
          Actions supplémentaires recommandées
        </Label>
        <Textarea
          id="furtherActions"
          name="furtherActions"
          value={formData.furtherActions}
          onChange={handleInputChange}
          placeholder="Recommandations pour la suite de la prise en charge..."
          rows={2}
          className="resize-none"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes" className="font-medium">
          Notes additionnelles
        </Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Autres informations pertinentes..."
          rows={2}
          className="resize-none"
        />
      </div>
    </div>
  );
};

export default StepTreatment;
