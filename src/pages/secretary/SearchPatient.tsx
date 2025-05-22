
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import SearchBar from '@/components/secretary/SearchBar';
import { usePatientStore } from '@/stores/usePatientStore';
import { differenceInYears } from 'date-fns';
import BackButton from '@/components/shared/BackButton';
import { useLanguage } from '@/hooks/useLanguage';

const SearchPatient = () => {
  const navigate = useNavigate();
  const patients = usePatientStore((state) => state.patients);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('time');
  const [activeFilters, setActiveFilters] = useState<string[]>(['name']);
  const { t } = useLanguage();

  const filteredAndSortedPatients = useMemo(() => {
    let result = [...patients];
    
    // Appliquer la recherche
    if (searchTerm) {
      result = result.filter(patient => {
        const searchLower = searchTerm.toLowerCase();
        
        // Recherche dans tous les champs selon les filtres actifs
        return activeFilters.some(filter => {
          switch (filter) {
            case 'name':
              return patient.name.toLowerCase().includes(searchLower) ||
                     patient.firstName.toLowerCase().includes(searchLower) ||
                     patient.lastName.toLowerCase().includes(searchLower);
            case 'company':
              return patient.company.toLowerCase().includes(searchLower);
            case 'age':
              const age = differenceInYears(new Date(), new Date(patient.birthDate));
              return age.toString().includes(searchLower);
            case 'service':
              return patient.service.toLowerCase().includes(searchLower);
            default:
              return false;
          }
        });
      });
    }

    // Appliquer le tri
    switch (sortOrder) {
      case 'alpha-asc':
        return result.sort((a, b) => a.name.localeCompare(b.name));
      case 'alpha-desc':
        return result.sort((a, b) => b.name.localeCompare(a.name));
      case 'time':
        return result.sort((a, b) => 
          new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
        );
      default:
        return result;
    }
  }, [patients, searchTerm, sortOrder, activeFilters]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackButton />
        <h1 className="text-2xl font-bold">{t('searchPatients')}</h1>
      </div>

      {/* Barre de recherche avec filtres */}
      <SearchBar
        onSearch={setSearchTerm}
        onSortChange={setSortOrder}
        onFilterChange={setActiveFilters}
        activeFilters={activeFilters}
      />

      {/* Liste des patients */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-medium text-gray-500 bg-gray-50 border-b">
                <th className="px-6 py-3 text-left">{t('id')}</th>
                <th className="px-6 py-3 text-left">{t('name')}</th>
                <th className="px-6 py-3 text-left">{t('company')}</th>
                <th className="px-6 py-3 text-left">{t('service')}</th>
                <th className="px-6 py-3 text-left">{t('status')}</th>
                <th className="px-6 py-3 text-left">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedPatients.map((patient) => (
                <tr key={patient.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/dashboard/secretary/patient/${patient.id}`)}>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.company}</td>
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      patient.status === "En cours" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/dashboard/secretary/patient/${patient.id}`);
                      }}
                    >
                      {t('viewDetails')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default SearchPatient;
