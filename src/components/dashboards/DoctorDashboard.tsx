
import React from 'react';
import { Users, Calendar, Hospital } from 'lucide-react';
import StatsCard from '@/components/shared/StatsCard';
import { useLanguage } from '@/hooks/useLanguage';

const DoctorDashboard = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6 bg-inherit">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title={t('waitingPatients')} value={5} icon={Users} iconColor="text-blue-600" />
        <StatsCard title={t('consultationsToday')} value={12} icon={Calendar} iconColor="text-green-600" />
        <StatsCard title={t('emergencies')} value={2} icon={Hospital} iconColor="text-red-600" />
      </div>

      <div className="rounded-lg shadow bg-inherit">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">{t('waitingPatientsForConsultation')}</h2>
        </div>
        <div className="p-0">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-medium text-gray-500 bg-gray-50 border-b">
                <th className="px-6 py-3 text-left">{t('id')}</th>
                <th className="px-6 py-3 text-left">{t('name')}</th>
                <th className="px-6 py-3 text-left">{t('type')}</th>
                <th className="px-6 py-3 text-left">{t('company')}</th>
                <th className="px-6 py-3 text-left">{t('waitTime')}</th>
                <th className="px-6 py-3 text-left">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {[{
              id: "P-1234",
              name: "Jean Dupont",
              type: "Cons",
              company: "PERENCO",
              waitTime: "15 min"
            }, {
              id: "P-1235",
              name: "Marie Lambert",
              type: "Ug",
              company: "Total SA",
              waitTime: "5 min"
            }, {
              id: "P-1236",
              name: "Philippe Martin",
              type: "Cons",
              company: "Dixstone",
              waitTime: "20 min"
            }].map(patient => (
                <tr key={patient.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{patient.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${patient.type === "Ug" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}>
                      {patient.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.waitTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a href="#" className={`text-white px-3 py-1 rounded text-xs font-medium ${patient.type === "Ug" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}>
                      {t('consult')}
                    </a>
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

export default DoctorDashboard;
