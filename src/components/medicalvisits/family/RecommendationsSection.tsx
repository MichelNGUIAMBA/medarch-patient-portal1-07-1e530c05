
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

interface RecommendationsSectionProps {
  recommendations: string;
  followUpNeeded: boolean;
  followUpDate: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (field: string, checked: boolean) => void;
}

const RecommendationsSection = ({
  recommendations,
  followUpNeeded,
  followUpDate,
  handleInputChange,
  handleCheckboxChange
}: RecommendationsSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium border-b pb-2">Recommandations</h3>
      
      <div className="space-y-2">
        <Label htmlFor="recommendations">Recommandations générales</Label>
        <Textarea
          id="recommendations"
          name="recommendations"
          placeholder="Recommandations médicales pour le membre de la famille"
          value={recommendations}
          onChange={handleInputChange}
          rows={3}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="followUpNeeded"
          checked={followUpNeeded}
          onCheckedChange={(checked) => handleCheckboxChange('followUpNeeded', checked as boolean)}
        />
        <Label htmlFor="followUpNeeded">Suivi nécessaire</Label>
      </div>
      
      {followUpNeeded && (
        <div className="space-y-2">
          <Label htmlFor="followUpDate">Date de suivi</Label>
          <Input
            id="followUpDate"
            name="followUpDate"
            type="date"
            value={followUpDate}
            onChange={handleInputChange}
          />
        </div>
      )}
    </div>
  );
};

export default RecommendationsSection;
