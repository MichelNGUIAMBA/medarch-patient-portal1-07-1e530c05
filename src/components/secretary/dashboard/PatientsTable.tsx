import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Patient } from '@/types/patient';
interface PatientsTableProps {
  patients: Patient[];
}
const PatientsTable = ({
  patients
}: PatientsTableProps) => {
  const navigate = useNavigate();
  return <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b rounded-none bg- bg-inherit">
        <h2 className="text-lg font-semibold flex items-center">
          <ClipboardCheck className="h-5 w-5 mr-2" />
          Derniers patients enregistrés
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs font-medium text-gray-500 bg-gray-50 border-b">
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Nom</th>
              <th className="px-6 py-3 text-left">Entreprise</th>
              <th className="px-6 py-3 text-left">Service</th>
              <th className="px-6 py-3 text-left">Statut</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(patient => <tr key={patient.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{patient.id}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium uppercase">{patient.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{patient.company}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${patient.service === "VM" ? "bg-blue-100 text-blue-800" : patient.service === "Ug" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                    {patient.service}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${patient.status === "En cours" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {patient.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50" onClick={() => navigate(`/dashboard/patient/${patient.id}`)}>
                    Afficher
                  </Button>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
};
export default PatientsTable;