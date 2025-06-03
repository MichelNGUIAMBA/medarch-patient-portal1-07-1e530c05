
import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { LabExamFormValues } from '@/types/labExam';

interface BiochemistrySectionProps {
  register: UseFormRegister<LabExamFormValues>;
}

const BiochemistrySection = ({ register }: BiochemistrySectionProps) => {
  return (
    <Card className="bg-card border-muted">
      <CardContent className="p-4">
        <h3 className="font-bold mb-2 uppercase text-sm bg-muted p-2 rounded">BIOCHIMIE</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="glycemia" 
              {...register('examData.biochemistry.glycemia')} 
            />
            <Label htmlFor="glycemia" className="text-green-600 dark:text-green-400">GLYCEMIE</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="uricAcid" 
              {...register('examData.biochemistry.uricAcid')} 
            />
            <Label htmlFor="uricAcid">ACIDE URIQUE CALCIUM</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="calcium" 
              {...register('examData.biochemistry.calcium')} 
            />
            <Label htmlFor="calcium">CALCIUM</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="magnesium" 
              {...register('examData.biochemistry.magnesium')} 
            />
            <Label htmlFor="magnesium">MAGNESIUM</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="potassium" 
              {...register('examData.biochemistry.potassium')} 
            />
            <Label htmlFor="potassium">POTASSIUM</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="amylasemia" 
              {...register('examData.biochemistry.amylasemia')} 
            />
            <Label htmlFor="amylasemia">AMYLASEMIE</Label>
          </div>
        </div>

        <h3 className="font-bold mt-4 mb-2 uppercase text-sm bg-muted p-2 rounded">FONCTION RENALE</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="urea" 
              {...register('examData.renalFunction.urea')} 
            />
            <Label htmlFor="urea">UREE</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="creatinine" 
              {...register('examData.renalFunction.creatinine')} 
            />
            <Label htmlFor="creatinine">CREATINE</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="renalProteins" 
              {...register('examData.renalFunction.proteins')} 
            />
            <Label htmlFor="renalProteins">PROTEINES SERIQUES</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="bloodIonogram" 
              {...register('examData.renalFunction.bloodIonogram')} 
            />
            <Label htmlFor="bloodIonogram">IONO SANG Na/K</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="urineIonogram" 
              {...register('examData.renalFunction.urineIonogram')} 
            />
            <Label htmlFor="urineIonogram">IONO URINES</Label>
          </div>
        </div>

        <h3 className="font-bold mt-4 mb-2 uppercase text-sm bg-muted p-2 rounded">FONCTION HEPATIQUE</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="got" 
              {...register('examData.hepaticFunction.got')} 
            />
            <Label htmlFor="got">GOT / GPT</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="gpt" 
              {...register('examData.hepaticFunction.gpt')} 
            />
            <Label htmlFor="gpt">GPT</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="hepaticProteins" 
              {...register('examData.hepaticFunction.proteins')} 
            />
            <Label htmlFor="hepaticProteins">PROTEINES SERIQUES</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="alkalinePhosphatase" 
              {...register('examData.hepaticFunction.alkalinePhosphatase')} 
            />
            <Label htmlFor="alkalinePhosphatase">PHOSPHATASES ALCALINES</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="totalBilirubin" 
              {...register('examData.hepaticFunction.totalBilirubin')} 
            />
            <Label htmlFor="totalBilirubin">BILIRUBINE TOTALE</Label>
          </div>
        </div>

        <h3 className="font-bold mt-4 mb-2 uppercase text-sm bg-muted p-2 rounded">BILAN LIPIDIQUE</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="cholesterol" 
              {...register('examData.lipidProfile.cholesterol')} 
            />
            <Label htmlFor="cholesterol">CHOLESTEROL</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="triglycerides" 
              {...register('examData.lipidProfile.triglycerides')} 
            />
            <Label htmlFor="triglycerides">TRIGLYCERIDES</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="hdlLdl" 
              {...register('examData.lipidProfile.hdlLdl')} 
            />
            <Label htmlFor="hdlLdl">HDL/LDL CHOLESTEROL</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BiochemistrySection;
