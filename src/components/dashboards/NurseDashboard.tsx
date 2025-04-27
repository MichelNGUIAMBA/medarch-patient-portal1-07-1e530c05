import React from 'react';
import { Calendar, ClipboardCheck, Hospital, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePatientStore } from '@/stores/usePatientStore';
import { format, differenceInMinutes } from 'date-fns';
import StatsCard from '@/components/shared/StatsCard';

const NurseDashboard = () => {
  const patients = usePatientStore((state) => state.patients);
  
  const patientStats = {
    vm: patients.filter(p => p.service === "VM").length,
    consultations: patients.filter(p => p.service === "Cons").length,
    emergencies: patients.filter(p => p.service === "Ug").length,
    waiting: patients.filter(p => p.status === "En attente").length
  };
  
  const calculateWaitTime = (registeredAt: string) => {
    const waitMinutes = differenceInMinutes(new Date(), new Date(registeredAt));
    return `${waitMinutes} min`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Visites médicales"
          value={patientStats.vm}
          icon={Calendar}
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Consultations"
          value={patientStats.consultations}
          icon={ClipboardCheck}
          iconColor="text-green-600"
        />
        <StatsCard
          title="Urgences"
          value={patientStats.emergencies}
          icon={Hospital}
          iconColor="text-red-600"
        />
        <StatsCard
          title="Patients en attente"
          value={patientStats.waiting}
          icon={Users}
          iconColor="text-purple-600"
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Patients à traiter</h2>
        </div>
        <div className="p-0">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-medium text-gray-500 bg-gray-50 border-b">
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Nom</th>
                <th className="px-6 py-3 text-left">Service</th>
                <th className="px-6 py-3 text-left">Temps d'attente</th>
                <th className="px-6 py-3 text-left">Entreprise</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.filter(p => p.status === "En attente").map((patient) => (
                <tr key={patient.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{patient.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      patient.service === "VM" 
                        ? "bg-blue-100 text-blue-800"
                        : patient.service === "Ug"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                      {patient.service}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{calculateWaitTime(patient.registeredAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                    <Button 
                      variant="default" 
                      size="sm"
                      className={`text-white px-3 py-1 rounded text-xs font-medium ${
                        patient.service === "Ug" 
                          ? "bg-red-600 hover:bg-red-700" 
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      Prendre en charge
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NurseDashboard;
