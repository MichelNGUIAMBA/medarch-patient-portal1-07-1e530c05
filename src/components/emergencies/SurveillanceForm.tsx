
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/hooks/useLanguage';

interface SurveillanceFormProps {
  initialData?: any;
  patientName?: string;
  onAddRow?: () => void;
  onSubmit?: (data: any) => void;
}

const SurveillanceForm: React.FC<SurveillanceFormProps> = ({ 
  initialData = {}, 
  patientName = "",
  onAddRow,
  onSubmit
}) => {
  const { t } = useLanguage();
  
  // État pour les lignes du tableau
  const [rows, setRows] = useState<Array<{
    date: string;
    time: string;
    ta: string;
    pulse: string;
    temperature: string;
    spo2: string;
    diuresis: string;
    observations: string;
  }>>(initialData.rows || [{
    date: "",
    time: "",
    ta: "",
    pulse: "",
    temperature: "",
    spo2: "",
    diuresis: "",
    observations: ""
  }]);

  const [room, setRoom] = useState(initialData.room || "");
  const [bed, setBed] = useState(initialData.bed || "");

  // Fonction pour ajouter une nouvelle ligne
  const handleAddRow = () => {
    setRows([...rows, {
      date: "",
      time: "",
      ta: "",
      pulse: "",
      temperature: "",
      spo2: "",
      diuresis: "",
      observations: ""
    }]);
    
    if (onAddRow) onAddRow();
  };

  // Gestion des changements dans les champs du tableau
  const handleRowChange = (index: number, field: string, value: string) => {
    const newRows = [...rows];
    newRows[index] = {
      ...newRows[index],
      [field]: value
    };
    setRows(newRows);
  };

  // Soumission du formulaire
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        formType: "surveillance",
        rows,
        room,
        bed,
        patientName
      });
    }
  };

  return (
    <Card className="border-red-200">
      <CardContent className="pt-6">
        <div className="text-xl font-bold text-center mb-4">FICHE DE SURVEILLANCE</div>
        
        <div className="flex justify-between mb-4">
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
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">DATE</TableHead>
                <TableHead className="w-[100px]">HEURE</TableHead>
                <TableHead className="w-[100px]">TA</TableHead>
                <TableHead className="w-[100px]">POULS</TableHead>
                <TableHead className="w-[100px]">T°</TableHead>
                <TableHead className="w-[100px]">SPO2</TableHead>
                <TableHead className="w-[100px]">DIURESE</TableHead>
                <TableHead>OBSERVATIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input 
                      type="date" 
                      value={row.date} 
                      onChange={(e) => handleRowChange(index, 'date', e.target.value)} 
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="time" 
                      value={row.time} 
                      onChange={(e) => handleRowChange(index, 'time', e.target.value)} 
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={row.ta} 
                      onChange={(e) => handleRowChange(index, 'ta', e.target.value)} 
                      placeholder="mmHg"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={row.pulse} 
                      onChange={(e) => handleRowChange(index, 'pulse', e.target.value)} 
                      placeholder="bpm"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={row.temperature} 
                      onChange={(e) => handleRowChange(index, 'temperature', e.target.value)} 
                      placeholder="°C"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={row.spo2} 
                      onChange={(e) => handleRowChange(index, 'spo2', e.target.value)} 
                      placeholder="%"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={row.diuresis} 
                      onChange={(e) => handleRowChange(index, 'diuresis', e.target.value)} 
                      placeholder="ml"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={row.observations} 
                      onChange={(e) => handleRowChange(index, 'observations', e.target.value)} 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 flex justify-between">
          <Button type="button" variant="outline" onClick={handleAddRow}>
            Ajouter une ligne
          </Button>
          
          <Button type="button" className="bg-red-600 hover:bg-red-700" onClick={handleSubmit}>
            Valider
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SurveillanceForm;
