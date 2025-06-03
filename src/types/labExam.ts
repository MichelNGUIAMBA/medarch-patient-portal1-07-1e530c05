
export type LabExam = {
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

export type LabExamFormValues = {
  patientId: string;
  examData: LabExam;
  signature: string;
};
