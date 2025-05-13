
export interface PatientStats {
  vm: number;
  cons: number;
  urg: number;
}

export interface ServiceHistoryEntry {
  serviceType: "VM" | "Cons" | "Ug";
  date: string;
  patientId: string;
  patientName: string;
}
