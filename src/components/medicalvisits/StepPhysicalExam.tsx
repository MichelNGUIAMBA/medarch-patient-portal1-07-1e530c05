import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
interface StepPhysicalExamProps {
  formData: {
    vision: string;
    hearing: string;
    respiratory: string;
    cardiovascular: string;
    musculoskeletal: string;
    neurological: string;
    fitForWork: boolean;
    restrictions: string;
    recommendations: string;
    followUpNeeded: boolean;
    followUpDate: string;
    notes: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (field: string, checked: boolean) => void;
}
const StepPhysicalExam = ({
  formData,
  handleInputChange,
  handleCheckboxChange
}: StepPhysicalExamProps) => {
  return <div className="space-y-6">
      <h3 className="text-lg font-medium">Examen physique</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vision" className="font-medium">
            Vision
          </Label>
          <Textarea id="vision" name="vision" value={formData.vision} onChange={handleInputChange} placeholder="Résultats de l'examen visuel..." rows={2} className="resize-none" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="hearing" className="font-medium">
            Audition
          </Label>
          <Textarea id="hearing" name="hearing" value={formData.hearing} onChange={handleInputChange} placeholder="Résultats de l'examen auditif..." rows={2} className="resize-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="respiratory" className="font-medium">
            Système respiratoire
          </Label>
          <Textarea id="respiratory" name="respiratory" value={formData.respiratory} onChange={handleInputChange} placeholder="Évaluation respiratoire..." rows={2} className="resize-none" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cardiovascular" className="font-medium">
            Système cardiovasculaire
          </Label>
          <Textarea id="cardiovascular" name="cardiovascular" value={formData.cardiovascular} onChange={handleInputChange} placeholder="Évaluation cardiovasculaire..." rows={2} className="resize-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="musculoskeletal" className="font-medium">
            Système musculo-squelettique
          </Label>
          <Textarea id="musculoskeletal" name="musculoskeletal" value={formData.musculoskeletal} onChange={handleInputChange} placeholder="Évaluation musculo-squelettique..." rows={2} className="resize-none" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="neurological" className="font-medium">
            Système neurologique
          </Label>
          <Textarea id="neurological" name="neurological" value={formData.neurological} onChange={handleInputChange} placeholder="Évaluation neurologique..." rows={2} className="resize-none" />
        </div>
      </div>

      <div className="border-t pt-4 mt-4">
        <h3 className="text-lg font-medium mb-4">Conclusion</h3>
        
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox id="fitForWork" checked={formData.fitForWork} onCheckedChange={checked => handleCheckboxChange('fitForWork', checked as boolean)} />
          <Label htmlFor="fitForWork" className="font-medium">
            Apte au travail
          </Label>
        </div>
        
        <div className="space-y-2 mb-4">
          <Label htmlFor="restrictions" className="font-medium">
            Restrictions éventuelles
          </Label>
          <Textarea id="restrictions" name="restrictions" value={formData.restrictions} onChange={handleInputChange} placeholder="Restrictions liées au travail..." rows={2} className="resize-none" />
        </div>
        
        <div className="space-y-2 mb-4">
          <Label htmlFor="recommendations" className="font-medium">
            Recommandations
          </Label>
          <Textarea id="recommendations" name="recommendations" value={formData.recommendations} onChange={handleInputChange} placeholder="Recommandations pour le travailleur..." rows={2} className="resize-none" />
        </div>
        
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox id="followUpNeeded" checked={formData.followUpNeeded} onCheckedChange={checked => handleCheckboxChange('followUpNeeded', checked as boolean)} />
          <Label htmlFor="followUpNeeded" className="font-medium">
            Suivi nécessaire
          </Label>
        </div>
        
        {formData.followUpNeeded && <div className="space-y-2 mb-4 ml-6 bg-inherit">
            <Label htmlFor="followUpDate" className="font-medium">
              Date de suivi suggérée
            </Label>
            <input type="date" id="followUpDate" name="followUpDate" value={formData.followUpDate} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-3 py-2 bg-inherit" />
          </div>}
        
        <div className="space-y-2">
          <Label htmlFor="notes" className="font-medium">
            Notes additionnelles
          </Label>
          <Textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} placeholder="Autres informations pertinentes..." rows={2} className="resize-none" />
        </div>
      </div>
    </div>;
};
export default StepPhysicalExam;