
import { create } from 'zustand';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export type ActivityType = 
  | 'patient_registration' 
  | 'service_assignment' 
  | 'medical_visit' 
  | 'consultation' 
  | 'emergency' 
  | 'lab_exam'
  | 'status_change';

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: string;
  performedBy: {
    id?: string;
    name: string;
    role: string;
  };
  patientId?: string;
  patientName?: string;
}

export interface DailyStats {
  date: string;
  totalPatients: number;
  newPatients: number;
  medicalVisits: number;
  consultations: number;
  emergencies: number;
  labExams: number;
  completedServices: number;
}

interface DailyActivityStore {
  activities: Record<string, Activity[]>;
  stats: Record<string, DailyStats>;
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  getActivitiesByDate: (date: string) => Activity[];
  getStatsByDate: (date: string) => DailyStats | null;
  getDates: () => string[];
}

export const useDailyActivityStore = create<DailyActivityStore>((set, get) => ({
  activities: {
    // Sample data for today
    [format(new Date(), 'yyyy-MM-dd')]: [
      {
        id: "act-1",
        type: "patient_registration",
        description: "Nouveau patient enregistré",
        timestamp: new Date().toISOString(),
        performedBy: {
          name: "Marie Dupont",
          role: "secretary"
        },
        patientId: "P-1234",
        patientName: "JEAN DUPONT"
      },
      {
        id: "act-2",
        type: "service_assignment",
        description: "Patient assigné au service VM",
        timestamp: new Date().toISOString(),
        performedBy: {
          name: "Marie Dupont",
          role: "secretary"
        },
        patientId: "P-1235",
        patientName: "MARIE LAMBERT"
      }
    ],
    // Sample data for yesterday
    [format(new Date(Date.now() - 86400000), 'yyyy-MM-dd')]: [
      {
        id: "act-3",
        type: "medical_visit",
        description: "Visite médicale terminée",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        performedBy: {
          name: "Dr. Claire Martin",
          role: "nurse"
        },
        patientId: "P-1236",
        patientName: "PAUL DUBOIS"
      }
    ]
  },
  stats: {
    // Sample stats for today
    [format(new Date(), 'yyyy-MM-dd')]: {
      date: format(new Date(), 'yyyy-MM-dd'),
      totalPatients: 15,
      newPatients: 3,
      medicalVisits: 8,
      consultations: 5,
      emergencies: 2,
      labExams: 4,
      completedServices: 12
    },
    // Sample stats for yesterday
    [format(new Date(Date.now() - 86400000), 'yyyy-MM-dd')]: {
      date: format(new Date(Date.now() - 86400000), 'yyyy-MM-dd'),
      totalPatients: 12,
      newPatients: 2,
      medicalVisits: 5,
      consultations: 4,
      emergencies: 1,
      labExams: 3,
      completedServices: 10
    }
  },
  addActivity: (activity) => set((state) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const activityId = `act-${Date.now()}`;
    
    const updatedActivities = {
      ...state.activities,
      [today]: [
        {
          ...activity,
          id: activityId
        },
        ...(state.activities[today] || [])
      ]
    };
    
    // Update stats based on activity type
    const currentStats = state.stats[today] || {
      date: today,
      totalPatients: 0,
      newPatients: 0,
      medicalVisits: 0,
      consultations: 0,
      emergencies: 0,
      labExams: 0,
      completedServices: 0
    };
    
    const updatedStats = { ...currentStats };
    
    switch (activity.type) {
      case 'patient_registration':
        updatedStats.newPatients += 1;
        updatedStats.totalPatients += 1;
        break;
      case 'medical_visit':
        updatedStats.medicalVisits += 1;
        break;
      case 'consultation':
        updatedStats.consultations += 1;
        break;
      case 'emergency':
        updatedStats.emergencies += 1;
        break;
      case 'lab_exam':
        updatedStats.labExams += 1;
        break;
      case 'status_change':
        if (activity.description.includes('Terminé')) {
          updatedStats.completedServices += 1;
        }
        break;
    }
    
    return {
      activities: updatedActivities,
      stats: {
        ...state.stats,
        [today]: updatedStats
      }
    };
  }),
  getActivitiesByDate: (date) => {
    return get().activities[date] || [];
  },
  getStatsByDate: (date) => {
    return get().stats[date] || null;
  },
  getDates: () => {
    return Object.keys(get().activities).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }
}));
