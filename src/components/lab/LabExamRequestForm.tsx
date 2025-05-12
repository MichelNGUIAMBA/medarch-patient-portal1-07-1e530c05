
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, ClipboardList, Signature } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';

interface LabExamRequestFormProps {
  onSubmit: (selectedExams: Record<string, boolean>, signature: string) => void;
  onCancel: () => void;
}

const LabExamRequestForm: React.FC<LabExamRequestFormProps> = ({ onSubmit, onCancel }) => {
  const { t } = useLanguage();
  const [signature, setSignature] = useState('');
  const [selectedExams, setSelectedExams] = useState<Record<string, boolean>>({});
  const currentDate = format(new Date(), 'yyyy-MM-dd');

  const handleExamChange = (examId: string, checked: boolean) => {
    setSelectedExams(prev => ({ ...prev, [examId]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signature.trim()) {
      toast.error(t('signatureRequired'));
      return;
    }

    // Vérifier si au moins un examen est sélectionné
    const hasSelectedExams = Object.values(selectedExams).some(value => value);
    if (!hasSelectedExams) {
      toast.error(t('selectAtLeastOneExam'));
      return;
    }

    onSubmit(selectedExams, signature);
  };

  return (
    <Card className="w-full border-blue-200">
      <CardHeader className="bg-blue-50 dark:bg-blue-950">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-600" />
          <CardTitle className="text-xl text-blue-700 dark:text-blue-400">
            {t('labExamRequest')}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* HEMATOLOGIE */}
            <div className="space-y-4">
              <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 font-semibold text-center">
                {t('hematology')}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hemogramme" 
                    onCheckedChange={(checked) => handleExamChange('hemogramme', checked as boolean)}
                  />
                  <Label htmlFor="hemogramme">{t('hemogram')}</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="vs" 
                    onCheckedChange={(checked) => handleExamChange('vs', checked as boolean)}
                  />
                  <Label htmlFor="vs">{t('sedimentationRate')}</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="groupeSanguin" 
                    onCheckedChange={(checked) => handleExamChange('groupeSanguin', checked as boolean)}
                  />
                  <Label htmlFor="groupeSanguin">{t('bloodType')}</Label>
                </div>
              </div>

              <Separator />
              
              {/* COAGULATION */}
              <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 font-semibold text-center">
                {t('coagulation')}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="tp" 
                    onCheckedChange={(checked) => handleExamChange('tp', checked as boolean)}
                  />
                  <Label htmlFor="tp">TP</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="tck" 
                    onCheckedChange={(checked) => handleExamChange('tck', checked as boolean)}
                  />
                  <Label htmlFor="tck">TCK</Label>
                </div>
              </div>

              <Separator />
              
              {/* BACTERIOLOGIE */}
              <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 font-semibold text-center">
                {t('bacteriology')}
              </div>
              
              <div className="space-y-2">
                <div className="font-medium mb-1">URINE S</div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="albumineGlucose" 
                    onCheckedChange={(checked) => handleExamChange('albumineGlucose', checked as boolean)}
                  />
                  <Label htmlFor="albumineGlucose">{t('albumineGlucose')}</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="leucocytesBiluribine" 
                    onCheckedChange={(checked) => handleExamChange('leucocytesBiluribine', checked as boolean)}
                  />
                  <Label htmlFor="leucocytesBiluribine">{t('leucocytesBiluribine')}</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="cetonesNitritesSang" 
                    onCheckedChange={(checked) => handleExamChange('cetonesNitritesSang', checked as boolean)}
                  />
                  <Label htmlFor="cetonesNitritesSang">{t('cetonesNitritesSang')}</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="ecbu" 
                    onCheckedChange={(checked) => handleExamChange('ecbu', checked as boolean)}
                  />
                  <Label htmlFor="ecbu">E.C.B.U.</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="antibiogramme" 
                    onCheckedChange={(checked) => handleExamChange('antibiogramme', checked as boolean)}
                  />
                  <Label htmlFor="antibiogramme">{t('antibiogram')}</Label>
                </div>
              </div>

              <Separator />
              
              {/* PARASITOLOGIE */}
              <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 font-semibold text-center">
                {t('parasitology')}
              </div>
              
              <div className="space-y-2">
                <div className="font-medium mb-1">SANG / SELLES</div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="paludismeQbc" 
                    onCheckedChange={(checked) => handleExamChange('paludismeQbc', checked as boolean)}
                  />
                  <Label htmlFor="paludismeQbc">{t('malariaQbc')}</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="microfilaires" 
                    onCheckedChange={(checked) => handleExamChange('microfilaires', checked as boolean)}
                  />
                  <Label htmlFor="microfilaires">{t('microfilaria')}</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="kaop" 
                    onCheckedChange={(checked) => handleExamChange('kaop', checked as boolean)}
                  />
                  <Label htmlFor="kaop">K.A.O.P.</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="amibiase" 
                    onCheckedChange={(checked) => handleExamChange('amibiase', checked as boolean)}
                  />
                  <Label htmlFor="amibiase">{t('amebiasis')}</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="widalFelix" 
                    onCheckedChange={(checked) => handleExamChange('widalFelix', checked as boolean)}
                  />
                  <Label htmlFor="widalFelix">WIDAL-FELIX</Label>
                </div>
              </div>
            </div>
            
            {/* BIOCHIMIE */}
            <div className="space-y-4">
              <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 font-semibold text-center">
                {t('biochemistry')}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="glycemie" 
                    onCheckedChange={(checked) => handleExamChange('glycemie', checked as boolean)}
                  />
                  <Label htmlFor="glycemie">{t('glycemia')}</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="acideUriqueCalcium" 
                    onCheckedChange={(checked) => handleExamChange('acideUriqueCalcium', checked as boolean)}
                  />
                  <Label htmlFor="acideUriqueCalcium">{t('uricAcidCalcium')}</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="calcium" 
                    onCheckedChange={(checked) => handleExamChange('calcium', checked as boolean)}
                  />
                  <Label htmlFor="calcium">{t('calcium')}</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="magnesium" 
                    onCheckedChange={(checked) => handleExamChange('magnesium', checked as boolean)}
                  />
                  <Label htmlFor="magnesium">{t('magnesium')}</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="amylasemie" 
                    onCheckedChange={(checked) => handleExamChange('amylasemie', checked as boolean)}
                  />
                  <Label htmlFor="amylasemie">{t('amylasemia')}</Label>
                </div>
              </div>

              <Separator />
              
              {/* FONCTION RENALE */}
              <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 font-semibold text-center">
                {t('kidneyFunction')}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="uree" 
                    onCheckedChange={(checked) => handleExamChange('uree', checked as boolean)}
                  />
                  <Label htmlFor="uree">{t('urea')}</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="creatine" 
                    onCheckedChange={(checked) => handleExamChange('creatine', checked as boolean)}
                  />
                  <Label htmlFor="creatine">{t('creatine')}</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="proteinesSériques" 
                    onCheckedChange={(checked) => handleExamChange('proteinesSériques', checked as boolean)}
                  />
                  <Label htmlFor="proteinesSériques">{t('serumProteins')}</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="ionoSangNaK" 
                    onCheckedChange={(checked) => handleExamChange('ionoSangNaK', checked as boolean)}
                  />
                  <Label htmlFor="ionoSangNaK">{t('bloodIonogram')}</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="ionoUrines" 
                    onCheckedChange={(checked) => handleExamChange('ionoUrines', checked as boolean)}
                  />
                  <Label htmlFor="ionoUrines">{t('urinaryIonogram')}</Label>
                </div>
              </div>

              <Separator />
              
              {/* FONCTION HEPATIQUE */}
              <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 font-semibold text-center">
                {t('liverFunction')}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="gotGpt" 
                    onCheckedChange={(checked) => handleExamChange('gotGpt', checked as boolean)}
                  />
                  <Label htmlFor="gotGpt">GOT / GPT</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="ggt" 
                    onCheckedChange={(checked) => handleExamChange('ggt', checked as boolean)}
                  />
                  <Label htmlFor="ggt">GGT</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="proteinesSériquesHepatic" 
                    onCheckedChange={(checked) => handleExamChange('proteinesSériquesHepatic', checked as boolean)}
                  />
                  <Label htmlFor="proteinesSériquesHepatic">{t('serumProteins')}</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="phosphatasesAlcalines" 
                    onCheckedChange={(checked) => handleExamChange('phosphatasesAlcalines', checked as boolean)}
                  />
                  <Label htmlFor="phosphatasesAlcalines">{t('alkalinePhosphatase')}</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="bilirubineTotale" 
                    onCheckedChange={(checked) => handleExamChange('bilirubineTotale', checked as boolean)}
                  />
                  <Label htmlFor="bilirubineTotale">{t('totalBilirubin')}</Label>
                </div>
              </div>

              <Separator />
              
              {/* BILAN LIPIDIQUE */}
              <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 font-semibold text-center">
                {t('lipidProfile')}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="cholesterol" 
                    onCheckedChange={(checked) => handleExamChange('cholesterol', checked as boolean)}
                  />
                  <Label htmlFor="cholesterol">{t('cholesterol')}</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="triglycerides" 
                    onCheckedChange={(checked) => handleExamChange('triglycerides', checked as boolean)}
                  />
                  <Label htmlFor="triglycerides">{t('triglycerides')}</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hdlLdlCholesterol" 
                    onCheckedChange={(checked) => handleExamChange('hdlLdlCholesterol', checked as boolean)}
                  />
                  <Label htmlFor="hdlLdlCholesterol">HDL/LDL {t('cholesterol')}</Label>
                </div>
              </div>
            </div>
            
            {/* IMMUNOLOGIE */}
            <div className="space-y-4">
              <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 font-semibold text-center">
                {t('immunology')}
              </div>
              
              <div className="space-y-4">
                <div className="font-medium text-center">SYPHILIS</div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="tphaVdrl" 
                    onCheckedChange={(checked) => handleExamChange('tphaVdrl', checked as boolean)}
                  />
                  <Label htmlFor="tphaVdrl">TPHA/VDRL</Label>
                </div>
                
                <div className="font-medium text-center mt-4">{t('hepatitisB')}</div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="antigeneHbs" 
                      onCheckedChange={(checked) => handleExamChange('antigeneHbs', checked as boolean)}
                    />
                    <Label htmlFor="antigeneHbs">{t('hbsAntigen')}</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="anticorpsHbs" 
                      onCheckedChange={(checked) => handleExamChange('anticorpsHbs', checked as boolean)}
                    />
                    <Label htmlFor="anticorpsHbs">{t('hbsAntibody')}</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="anticorpsHbc" 
                      onCheckedChange={(checked) => handleExamChange('anticorpsHbc', checked as boolean)}
                    />
                    <Label htmlFor="anticorpsHbc">{t('hbcAntibody')}</Label>
                  </div>
                </div>
                
                <div className="font-medium text-center mt-4">CMV</div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="anticorpsAntiCmv" 
                    onCheckedChange={(checked) => handleExamChange('anticorpsAntiCmv', checked as boolean)}
                  />
                  <Label htmlFor="anticorpsAntiCmv">{t('cmvAntibody')}</Label>
                </div>
                
                <div className="font-medium text-center mt-4">{t('hepatitisC')}</div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="anticorpsAntiHc" 
                    onCheckedChange={(checked) => handleExamChange('anticorpsAntiHc', checked as boolean)}
                  />
                  <Label htmlFor="anticorpsAntiHc">{t('hcvAntibody')}</Label>
                </div>
                
                <div className="font-medium text-center mt-4">HIV</div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="anticorpsAntiHiv" 
                    onCheckedChange={(checked) => handleExamChange('anticorpsAntiHiv', checked as boolean)}
                  />
                  <Label htmlFor="anticorpsAntiHiv">{t('hivAntibody')}</Label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <Label htmlFor="labRequestDate">{t('date')}</Label>
              <Input
                id="labRequestDate"
                type="date"
                value={currentDate}
                readOnly
                className="mt-1"
              />
            </div>
            
            <div className="col-span-1">
              <div className="flex items-center mb-1">
                <Signature className="h-4 w-4 mr-1 text-red-500" />
                <Label htmlFor="signature" className="text-red-500 font-medium">
                  {t('signature')} *
                </Label>
              </div>
              <Input
                id="signature"
                type="text"
                placeholder={t('enterSignature')}
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                className="mt-1"
                required
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white" 
          onClick={handleSubmit}
        >
          <ClipboardList className="h-4 w-4 mr-2" />
          {t('submitLabRequest')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LabExamRequestForm;
