
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface StepInitialAssessmentProps {
  formData: {
    emergencySeverity: string;
    mainComplaint: string;
    triageNotes: string;
    consciousness: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (field: string, value: string) => void;
}

const StepInitialAssessment = ({ 
  formData, 
  handleInputChange, 
  handleSelectChange 
}: StepInitialAssessmentProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="emergencySeverity" className="text-red-600 font-medium">
          Niveau de gravité <span className="text-red-500">*</span>
        </Label>
        <Select 
          value={formData.emergencySeverity} 
          onValueChange={(value) => handleSelectChange('emergencySeverity', value)}
        >
          <SelectTrigger id="emergencySeverity" className="w-full">
            <SelectValue placeholder="Sélectionnez le niveau de gravité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low" className="text-green-600">Faible - Non urgent</SelectItem>
            <SelectItem value="medium" className="text-amber-600">Moyen - Semi-urgent</SelectItem>
            <SelectItem value="high" className="text-red-600">Élevé - Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="mainComplaint" className="font-medium">
          Motif principal de l'urgence <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="mainComplaint"
          name="mainComplaint"
          value={formData.mainComplaint}
          onChange={handleInputChange}
          placeholder="Description du problème principal..."
          rows={3}
          className="resize-none"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="consciousness" className="font-medium">
          État de conscience <span className="text-red-500">*</span>
        </Label>
        <Select 
          value={formData.consciousness} 
          onValueChange={(value) => handleSelectChange('consciousness', value)}
        >
          <SelectTrigger id="consciousness" className="w-full">
            <SelectValue placeholder="Sélectionnez l'état de conscience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alert" className="text-green-600">Alerte</SelectItem>
            <SelectItem value="verbal" className="text-blue-600">Réaction aux stimuli verbaux</SelectItem>
            <SelectItem value="pain" className="text-amber-600">Réaction aux stimuli douloureux</SelectItem>
            <SelectItem value="unresponsive" className="text-red-600">Non réactif</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="triageNotes" className="font-medium">
          Notes du triage <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="triageNotes"
          name="triageNotes"
          value={formData.triageNotes}
          onChange={handleInputChange}
          placeholder="Notes détaillées sur l'état du patient..."
          rows={4}
          className="resize-none"
        />
      </div>
    </div>
  );
};

export default StepInitialAssessment;
