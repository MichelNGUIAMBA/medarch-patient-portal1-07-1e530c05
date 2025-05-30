
import React, { useState, useMemo } from 'react';
import { useSupabasePatients } from '@/hooks/useSupabasePatients';
import SearchBar from '@/components/secretary/SearchBar';
import StatsCards from '@/components/secretary/dashboard/StatsCards';
import QuickActions from '@/components/secretary/dashboard/QuickActions';
import PatientsTable from '@/components/secretary/dashboard/PatientsTable';
import { differenceInYears } from 'date-fns';
import { useLanguage } from '@/hooks/useLanguage';

const SecretaryDashboard = () => {
  const { patients, loading } = useSupabasePatients();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('time');
  const [activeFilters, setActiveFilters] = useState<string[]>(['name']);
  const { t } = useLanguage();
  
  const filteredAndSortedPatients = useMemo(() => {
    let result = [...patients];
    
    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      result = result.filter(patient => {
        return activeFilters.some(filter => {
          switch (filter) {
            case 'name':
              return patient.first_name.toLowerCase().includes(searchLower) || 
                     patient.last_name.toLowerCase().includes(searchLower) ||
                     patient.name.toLowerCase().includes(searchLower);
            case 'company':
              return patient.companies?.name.toLowerCase().includes(searchLower);
            case 'age':
              const age = differenceInYears(new Date(), new Date(patient.birth_date));
              return age.toString().includes(searchLower);
            case 'service':
              return patient.service.toLowerCase().includes(searchLower);
            default:
              return false;
          }
        });
      });
    }
    
    // Apply sorting
    switch (sortOrder) {
      case 'alpha-asc':
        return result.sort((a, b) => a.name.localeCompare(b.name));
      case 'alpha-desc':
        return result.sort((a, b) => b.name.localeCompare(a.name));
      case 'time':
        return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      default:
        return result;
    }
  }, [patients, searchTerm, sortOrder, activeFilters]);
  
  const waitingListData = {
    vm: patients.filter(p => p.service === "VM" && p.status === "En attente").length,
    cons: patients.filter(p => p.service === "Cons" && p.status === "En attente").length,
    urg: patients.filter(p => p.service === "Ug").length
  };
  
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };
  
  const handleSortChange = (value: string) => {
    setSortOrder(value);
  };
  
  const handleFilterChange = (filters: string[]) => {
    setActiveFilters(filters);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 bg-inherit rounded-sm">
      <StatsCards stats={waitingListData} />
      <QuickActions />
      <SearchBar 
        onSearch={handleSearchChange} 
        onSortChange={handleSortChange} 
        onFilterChange={handleFilterChange} 
        activeFilters={activeFilters} 
      />
      <PatientsTable patients={filteredAndSortedPatients.map(patient => ({
        id: patient.id,
        name: patient.name,
        firstName: patient.first_name,
        lastName: patient.last_name,
        birthDate: patient.birth_date,
        company: patient.companies?.name || '',
        service: patient.service as "VM" | "Cons" | "Ug",
        status: patient.status as "En attente" | "En cours" | "Terminé",
        registeredAt: patient.created_at,
        gender: patient.gender,
        originalPatientId: patient.original_patient_id
      }))} />
    </div>
  );
};

export default SecretaryDashboard;
