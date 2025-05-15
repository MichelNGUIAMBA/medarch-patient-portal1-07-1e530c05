
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/hooks/useLanguage';

interface ObservationFormProps {
  initialData?: any;
  patientName?: string;
  onSubmit?: (data: any) => void;
}

const ObservationForm: React.FC<ObservationFormProps> = ({ 
  initialData = {}, 
  patientName = "",
  onSubmit
}) => {
  const { t } = useLanguage();
  
  const [room, setRoom] = useState(initialData.room || "");
  const [bed, setBed] = useState(initialData.bed || "");
  const [observations, setObservations] = useState(initialData.observations || "");
  
  // Soumission du formulaire
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        formType: "observation",
        room,
        bed,
        observations,
        patientName
      });
    }
  };

  return (
    <Card className="border-red-200">
      <CardContent className="pt-6">
        <div className="text-sm text-center text-gray-600 mb-1">Poste de Médecine du Travail</div>
        <div className="text-xl font-bold text-center mb-4">FICHE D'OBSERVATION</div>
        
        <div className="flex justify-between mb-6">
          <div className="flex-1">
            <Label>NOM ET PRÉNOM :</Label>
            <Input value={patientName} readOnly className="bg-gray-50" />
          </div>
          <div className="mx-2 flex-1">
            <Label>CHAMBRE :</Label>
            <Input value={room} onChange={(e) => setRoom(e.target.value)} />
          </div>
          <div className="flex-1">
            <Label>LIT :</Label>
            <Input value={bed} onChange={(e) => setBed(e.target.value)} />
          </div>
        </div>
        
        <div className="mb-6">
          <Label>Observations:</Label>
          <Textarea 
            value={observations} 
            onChange={(e) => setObservations(e.target.value)}
            className="min-h-[300px]"
          />
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button 
            type="button" 
            className="bg-red-600 hover:bg-red-700" 
            onClick={handleSubmit}
          >
            Valider
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ObservationForm;
