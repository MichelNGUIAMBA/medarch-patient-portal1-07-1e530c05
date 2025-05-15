
import { useState } from 'react';
import { toast } from '@/components/ui/sonner';

interface MedicalFormData {
  [key: string]: any;
}

interface UseMedicalVisitFormProps {
  initialData?: MedicalFormData;
  type: 'standard' | 'annual' | 'family';
}

export const useMedicalVisitForm = ({ initialData = {}, type }: UseMedicalVisitFormProps) => {
  const [formData, setFormData] = useState({
    // Common fields across all form types
    temperature: initialData.temperature || '',
    bloodPressureSys: initialData.bloodPressureSys || '',
    bloodPressureDia: initialData.bloodPressureDia || '',
    heartRate: initialData.heartRate || '',
    oxygenSaturation: initialData.oxygenSaturation || '',
    recommendations: initialData.recommendations || '',
    followUpNeeded: initialData.followUpNeeded || false,
    followUpDate: initialData.followUpDate || '',
    
    // Fields specific to standard visit
    ...(type === 'standard' && {
      workstation: initialData.workstation || '',
      exposureFactors: initialData.exposureFactors || '',
      protectiveEquipment: initialData.protectiveEquipment || '',
      workplaceRisks: initialData.workplaceRisks || '',
      vision: initialData.vision || '',
      hearing: initialData.hearing || '',
      respiratory: initialData.respiratory || '',
      cardiovascular: initialData.cardiovascular || '',
      musculoskeletal: initialData.musculoskeletal || '',
      neurological: initialData.neurological || '',
      fitForWork: initialData.fitForWork !== undefined ? initialData.fitForWork : true,
      restrictions: initialData.restrictions || '',
      notes: initialData.notes || '',
    }),
    
    // Fields specific to annual visit
    ...(type === 'annual' && {
      vmaData: {
        generalHealth: initialData.vmaData?.generalHealth || '',
        familyHistory: initialData.vmaData?.familyHistory || '',
        occupationalHistory: initialData.vmaData?.occupationalHistory || '',
        currentTreatments: initialData.vmaData?.currentTreatments || '',
        allergies: initialData.vmaData?.allergies || '',
        smoking: initialData.vmaData?.smoking || false,
        alcohol: initialData.vmaData?.alcohol || false,
        physicalActivity: initialData.vmaData?.physicalActivity || '',
        specializedTests: initialData.vmaData?.specializedTests || '',
      }
    }),
    
    // Fields specific to family visit
    ...(type === 'family' && {
      vmafData: {
        relationship: initialData.vmafData?.relationship || '',
        chronicConditions: initialData.vmafData?.chronicConditions || '',
        childrenVaccinations: initialData.vmafData?.childrenVaccinations || '',
        lifestyleFactors: initialData.vmafData?.lifestyleFactors || '',
        medicalCoverage: initialData.vmafData?.medicalCoverage || '',
      }
    }),
    
    // Visit type
    visitType: type,
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested fields (e.g. vmaData.generalHealth)
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleCheckboxChange = (field: string, checked: boolean) => {
    // Handle nested fields
    if (field.includes('.')) {
      const [section, fieldName] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [fieldName]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: checked
      }));
    }
  };
  
  const handleSelectChange = (field: string, value: string) => {
    // Handle nested fields
    if (field.includes('.')) {
      const [section, fieldName] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [fieldName]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  
  const validateRequiredFields = (fields: string[]) => {
    const missingFields = fields.filter(field => {
      if (field.includes('.')) {
        const [section, fieldName] = field.split('.');
        return !formData[section as keyof typeof formData]?.[fieldName];
      }
      return !formData[field as keyof typeof formData];
    });
    
    if (missingFields.length > 0) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return false;
    }
    return true;
  };
  
  return {
    formData,
    handleInputChange,
    handleCheckboxChange,
    handleSelectChange,
    validateRequiredFields
  };
};
