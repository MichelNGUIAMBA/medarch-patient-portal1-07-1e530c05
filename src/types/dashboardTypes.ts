
export interface PatientStats {
  vm: number;
  cons: number;
  urg: number;
}

export interface DailyPatientStats {
  byService: {
    vm: number;
    cons: number;
    urg: number;
  };
  byStatus: {
    waiting: number;
    inTreatment: number;
    completed: number;
  };
  total: number;
}
