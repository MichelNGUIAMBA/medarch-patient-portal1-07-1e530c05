
import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { LabExamFormValues } from '@/types/labExam';

interface ImmunologySectionProps {
  register: UseFormRegister<LabExamFormValues>;
}

const ImmunologySection = ({ register }: ImmunologySectionProps) => {
  return (
    <Card className="bg-card border-muted">
      <CardContent className="p-4">
        <h3 className="font-bold mb-2 uppercase text-sm bg-muted p-2 rounded">IMMUNOLOGIE</h3>
        
        <div className="space-y-4">
          <div>
            <p className="font-semibold uppercase mb-2">SYPHILIS</p>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="tpha" 
                {...register('examData.immunology.syphilis.tpha')} 
              />
              <Label htmlFor="tpha">TPHA/VDRL</Label>
            </div>
          </div>

          <div>
            <p className="font-semibold uppercase mb-2">HÉPATITE B</p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="antigenHbs" 
                  {...register('examData.immunology.hepatitisB.antigenHbs')} 
                />
                <Label htmlFor="antigenHbs">ANTIGENE HBS</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="antibodyHbs" 
                  {...register('examData.immunology.hepatitisB.antibodyHbs')} 
                />
                <Label htmlFor="antibodyHbs">ANTICORPS HBS</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="antibodyHbc" 
                  {...register('examData.immunology.hepatitisB.antibodyHbc')} 
                />
                <Label htmlFor="antibodyHbc">ANTICORPS HBC</Label>
              </div>
            </div>
          </div>

          <div>
            <p className="font-semibold uppercase mb-2">CMV</p>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="antibodyCmv" 
                {...register('examData.immunology.cmv.antibodyCmv')} 
              />
              <Label htmlFor="antibodyCmv">ANTICORPS ANTI-CMV</Label>
            </div>
          </div>

          <div>
            <p className="font-semibold uppercase mb-2">HÉPATITE C</p>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="antibodyHcv" 
                {...register('examData.immunology.hepatitisC.antibodyHcv')} 
              />
              <Label htmlFor="antibodyHcv">ANTICORPS ANTI-HC</Label>
            </div>
          </div>

          <div>
            <p className="font-semibold uppercase mb-2">HIV</p>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="antibodyHiv" 
                {...register('examData.immunology.hiv.antibodyHiv')} 
              />
              <Label htmlFor="antibodyHiv">ANTICORPS ANTI-HIV</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImmunologySection;
