
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PatientSelect } from '@/components/exams/PatientSelect';
import { useAuth } from '@/hooks/use-auth-context';
import { usePatientStore } from '@/stores/usePatientStore';
import { toast } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';

type LabExam = {
  hematology: {
    hemogram: boolean;
    vs: boolean;
    bloodGroup: boolean;
  };
  coagulation: {
    tp: boolean;
    tck: boolean;
  };
  biochemistry: {
    glycemia: boolean;
    uricAcid: boolean;
    calcium: boolean;
    magnesium: boolean;
    potassium: boolean;
    amylasemia: boolean;
  };
  bacteriology: {
    urines: {
      albumineGlucose: boolean;
      leukocytesProteinuria: boolean;
      ketonesNitrites: boolean;
      ecbu: boolean;
      antibiogram: boolean;
    }
  };
  parasitology: {
    blood: {
      malaria: boolean;
      microfilariae: boolean;
      kaop: boolean;
      amibiasis: boolean;
      widalFelix: boolean;
    }
  };
  renalFunction: {
    urea: boolean;
    creatinine: boolean;
    proteins: boolean;
    bloodIonogram: boolean;
    urineIonogram: boolean;
  };
  hepaticFunction: {
    got: boolean;
    gpt: boolean;
    proteins: boolean;
    alkalinePhosphatase: boolean;
    totalBilirubin: boolean;
  };
  lipidProfile: {
    cholesterol: boolean;
    triglycerides: boolean;
    hdlLdl: boolean;
  };
  immunology: {
    syphilis: {
      tpha: boolean;
    },
    hepatitisB: {
      antigenHbs: boolean;
      antibodyHbs: boolean;
      antibodyHbc: boolean;
    },
    cmv: {
      antibodyCmv: boolean;
    },
    hepatitisC: {
      antibodyHcv: boolean;
    },
    hiv: {
      antibodyHiv: boolean;
    }
  };
};

type FormValues = {
  patientId: string;
  examData: LabExam;
  signature: string;
};

const LabExamForm = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormValues>();
  const { requestLabExams } = usePatientStore();
  const [selectedPatientId, setSelectedPatientId] = useState("");

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(patientId);
    setValue('patientId', patientId);
  };

  const onSubmit = (data: FormValues) => {
    if (!user) {
      toast.error(t('mustBeLoggedIn'));
      return;
    }

    // Créer une liste des examens cochés
    const requestedExams = [];
    
    // Traiter tous les examens cochés pour les convertir en format approprié
    const examData = data.examData;
    
    const addExamsFromCategory = (category: string, subcategory: string, items: Record<string, boolean>) => {
      for (const [key, value] of Object.entries(items)) {
        if (value) {
          requestedExams.push({
            type: `${category}.${subcategory}.${key}`,
            status: 'pending'
          });
        }
      }
    };
    
    // Parcourir chaque catégorie et sous-catégorie
    if (examData) {
      for (const [category, categoryData] of Object.entries(examData)) {
        if (typeof categoryData === 'object') {
          for (const [subcategory, items] of Object.entries(categoryData)) {
            if (typeof items === 'object') {
              addExamsFromCategory(category, subcategory, items as Record<string, boolean>);
            } else if (items) {
              requestedExams.push({
                type: `${category}.${subcategory}`,
                status: 'pending'
              });
            }
          }
        }
      }
    }
    
    if (requestedExams.length === 0) {
      toast.error(t('selectAtLeastOneExam'));
      return;
    }
    
    if (!data.signature) {
      toast.error(t('signatureRequired'));
      return;
    }
    
    try {
      requestLabExams(
        data.patientId, 
        requestedExams, 
        { name: user.name, role: user.role }
      );
      
      toast.success(t('labExamsRequested'));
      setSelectedPatientId("");
      setValue('patientId', "");
      // Réinitialiser les cases à cocher
      setValue('examData', {} as LabExam);
      setValue('signature', "");
    } catch (error) {
      toast.error(t('errorRequestingExams'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b">
        <h2 className="text-xl font-bold">Exam Labo (EL)</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="patientId">{t('patient')}</Label>
          <PatientSelect
            onSelectPatient={handlePatientSelect}
            selectedPatientId={selectedPatientId}
          />
          {errors.patientId && <p className="text-red-500 text-sm mt-1">{errors.patientId.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Hématologie */}
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

          {/* Biochimie et fonctions */}
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

          {/* Immunologie */}
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
        </div>

        <div className="flex justify-between items-end border-t pt-4">
          <div className="w-1/3">
            <Label htmlFor="signature">{t('signature')}</Label>
            <Input 
              id="signature" 
              {...register('signature', { required: t('signatureRequired') })} 
              placeholder={t('enterSignature')}
              className="bg-background"
            />
            {errors.signature && <p className="text-red-500 text-sm mt-1">{errors.signature.message}</p>}
          </div>
          <div>
            <p className="text-sm mb-2">{t('date')}: {new Date().toLocaleDateString()}</p>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {t('requestExam')}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LabExamForm;
