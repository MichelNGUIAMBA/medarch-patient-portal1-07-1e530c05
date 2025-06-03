
import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { LabExamFormValues } from '@/types/labExam';

interface HematologySectionProps {
  register: UseFormRegister<LabExamFormValues>;
}

const HematologySection = ({ register }: HematologySectionProps) => {
  return (
    <Card className="bg-card border-muted">
      <CardContent className="p-4">
        <h3 className="font-bold mb-2 uppercase text-sm bg-muted p-2 rounded">HEMATOLOGIE</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="hemogram" 
              {...register('examData.hematology.hemogram')} 
            />
            <Label htmlFor="hemogram" className="text-primary">HEMOGRAMME</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="vs" 
              {...register('examData.hematology.vs')} 
            />
            <Label htmlFor="vs">V.S.</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="bloodGroup" 
              {...register('examData.hematology.bloodGroup')} 
            />
            <Label htmlFor="bloodGroup" className="text-amber-600 dark:text-amber-400">GROUPE SANGUIN</Label>
          </div>
        </div>

        <h3 className="font-bold mt-4 mb-2 uppercase text-sm bg-muted p-2 rounded">COAGULATION</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="tp" 
              {...register('examData.coagulation.tp')} 
            />
            <Label htmlFor="tp">TP</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="tck" 
              {...register('examData.coagulation.tck')} 
            />
            <Label htmlFor="tck">TCK</Label>
          </div>
        </div>

        <h3 className="font-bold mt-4 mb-2 uppercase text-sm bg-muted p-2 rounded">BACTERIOLOGIE</h3>
        <div className="space-y-2">
          <p className="font-semibold underline">URINES</p>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="albumineGlucose" 
              {...register('examData.bacteriology.urines.albumineGlucose')} 
            />
            <Label htmlFor="albumineGlucose">ALBUMINE / GLUCOSE</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="leukocytesProteinuria" 
              {...register('examData.bacteriology.urines.leukocytesProteinuria')} 
            />
            <Label htmlFor="leukocytesProteinuria">LEUCOCYTES / ALBUMINURIE</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="ketonesNitrites" 
              {...register('examData.bacteriology.urines.ketonesNitrites')} 
            />
            <Label htmlFor="ketonesNitrites">CETONES / NITRITES SANG</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="ecbu" 
              {...register('examData.bacteriology.urines.ecbu')} 
            />
            <Label htmlFor="ecbu">E.C.B.U.</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="antibiogram" 
              {...register('examData.bacteriology.urines.antibiogram')} 
            />
            <Label htmlFor="antibiogram">ANTIBIOGRAMME</Label>
          </div>
        </div>

        <h3 className="font-bold mt-4 mb-2 uppercase text-sm bg-muted p-2 rounded">PARASITOLOGIE</h3>
        <div className="space-y-2">
          <p className="font-semibold underline">SANG / SELLES</p>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="malaria" 
              {...register('examData.parasitology.blood.malaria')} 
            />
            <Label htmlFor="malaria">PALUDISME GE</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="microfilariae" 
              {...register('examData.parasitology.blood.microfilariae')} 
            />
            <Label htmlFor="microfilariae" className="text-primary">MICROFILAIRES</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="kaop" 
              {...register('examData.parasitology.blood.kaop')} 
            />
            <Label htmlFor="kaop">K.A.O.P.</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="amibiasis" 
              {...register('examData.parasitology.blood.amibiasis')} 
            />
            <Label htmlFor="amibiasis">AMIBIASE</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="widalFelix" 
              {...register('examData.parasitology.blood.widalFelix')} 
            />
            <Label htmlFor="widalFelix">WIDAL-FELIX</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HematologySection;
