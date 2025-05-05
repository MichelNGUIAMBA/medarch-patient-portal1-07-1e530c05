
import { PatientState } from './types';

export const initialPatientState: PatientState = {
  patients: [
    { 
      id: "P-1234", 
      name: "JEAN DUPONT", 
      firstName: "Jean",
      lastName: "Dupont",
      company: "PERENCO", 
      service: "VM", 
      status: "En attente",
      birthDate: "1990-05-15",
      registeredAt: "2025-04-25T08:30:00",
      gender: "M",
      employeeId: "EMP001"
    },
    { 
      id: "P-1235", 
      name: "MARIE LAMBERT", 
      firstName: "Marie",
      lastName: "Lambert",
      company: "Total SA", 
      service: "Ug", 
      status: "En cours",
      birthDate: "1988-12-03",
      registeredAt: "2025-04-25T09:15:00",
      gender: "F",
      employeeId: "EMP002",
      takenCareBy: {
        name: "Dr Sophie Martin",
        role: "Médecin urgentiste"
      }
    },
    { 
      id: "P-1236", 
      name: "PAUL DUBOIS", 
      firstName: "Paul",
      lastName: "Dubois",
      company: "PERENCO", 
      service: "Cons", 
      status: "Terminé",
      birthDate: "1978-06-22",
      registeredAt: "2025-04-25T10:00:00",
      gender: "M",
      employeeId: "EMP003",
      notes: "Consultation routine, pas de problème détecté.",
      takenCareBy: {
        name: "Dr Michel Bernard",
        role: "Médecin généraliste"
      },
      modificationHistory: [
        {
          field: "status",
          oldValue: "En cours",
          newValue: "Terminé",
          modifiedBy: {
            name: "Dr Michel Bernard",
            role: "Médecin généraliste"
          },
          timestamp: "2025-04-25T11:30:00"
        }
      ]
    },
    { 
      id: "P-1237", 
      name: "LUCIE MARTIN", 
      firstName: "Lucie",
      lastName: "Martin",
      company: "Total SA", 
      service: "VM", 
      status: "En cours",
      birthDate: "1992-08-17",
      registeredAt: "2025-04-25T10:30:00",
      gender: "F",
      employeeId: "EMP004",
      takenCareBy: {
        name: "Infirmière Claire Dupont",
        role: "Infirmière"
      }
    }
  ]
};
