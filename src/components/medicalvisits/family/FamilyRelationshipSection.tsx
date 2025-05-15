
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FamilyRelationshipSectionProps {
  relationship: string;
  handleSelectChange: (field: string, value: string) => void;
}

const FamilyRelationshipSection = ({ 
  relationship, 
  handleSelectChange 
}: FamilyRelationshipSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium border-b pb-2">Information sur le membre de la famille</h3>
      
      <div className="space-y-2">
        <Label htmlFor="vmafData.relationship">Relation avec l'employé *</Label>
        <Select 
          onValueChange={(value) => handleSelectChange('vmafData.relationship', value)}
          value={relationship || ''}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner la relation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="conjoint">Conjoint(e)</SelectItem>
            <SelectItem value="enfant">Enfant</SelectItem>
            <SelectItem value="parent">Parent</SelectItem>
            <SelectItem value="autre">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FamilyRelationshipSection;
