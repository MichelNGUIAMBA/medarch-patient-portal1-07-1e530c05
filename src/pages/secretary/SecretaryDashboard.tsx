
import React, { useState, useMemo } from 'react';
import { usePatientStore } from '@/stores/usePatientStore';
import { useDailyActivityStore } from '@/stores/useDailyActivityStore';
import SearchBar from '@/components/secretary/SearchBar';
import StatsCards from '@/components/secretary/dashboard/StatsCards';
import QuickActions from '@/components/secretary/dashboard/QuickActions';
import PatientsTable from '@/components/secretary/dashboard/PatientsTable';
import { differenceInYears } from 'date-fns';
import { useAuth } from '@/hooks/use-auth-context';

const SecretaryDashboard = () => {
  const { user } = useAuth();
  const patients = usePatientStore((state) => state.patients);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('time');
  const [activeFilters, setActiveFilters] = useState<string[]>(['name']);
  const addActivity = useDailyActivityStore(state => state.addActivity);

  // Track if we've initialized for today
  const [initializedToday] = useState(() => {
    // In a real app, you might want to check localStorage or other state
    // to determine if this is the first load for today
    return true;
  });

  // At the beginning of each day, we want to reset the service and status fields
  // This would typically be handled by a more sophisticated mechanism in a real app
  useMemo(() => {
    if (!initializedToday && user) {
      // This is where you might reset patient statuses for a new day
      // For demo purposes, we'll just log an activity
      addActivity({
        type: 'status_change',
        description: 'Début de journée - réinitialisation des statuts',
        timestamp: new Date().toISOString(),
        performedBy: {
          name: user.name,
          role: user.role
        }
      });
    }
  }, [initializedToday, addActivity, user]);

  const filteredAndSortedPatients = useMemo(() => {
    let result = [...patients];
    
    if (searchTerm) {
      result = result.filter(patient => {
        const searchLower = searchTerm.toLowerCase();
        
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

  const waitingListData = {
    vm: patients.filter(p => p.service === "VM" && p.status === "En attente").length,
    cons: patients.filter(p => p.service === "Cons" && p.status === "En attente").length,
    urg: patients.filter(p => p.service === "Ug").length,
  };

  return (
    <div className="space-y-6">
      <StatsCards stats={waitingListData} />
      <QuickActions />
      <SearchBar
        onSearch={setSearchTerm}
        onSortChange={setSortOrder}
        onFilterChange={setActiveFilters}
        activeFilters={activeFilters}
      />
      <PatientsTable patients={filteredAndSortedPatients} />
    </div>
  );
};

export default SecretaryDashboard;
