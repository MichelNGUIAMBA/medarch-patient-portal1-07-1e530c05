
import React from 'react';
import UniversalSearchBar from '@/components/shared/UniversalSearchBar';
import { useLanguage } from '@/hooks/useLanguage';

interface SearchBarProps {
  onSearch: (value: string) => void;
  onSortChange: (value: string) => void;
  onFilterChange: (filters: string[]) => void;
  activeFilters: string[];
}

const SearchBar = ({
  onSearch,
  onSortChange,
  onFilterChange,
  activeFilters
}: SearchBarProps) => {
  const { t } = useLanguage();
  
  const availableFilters = [
    { key: 'name', label: t('name') },
    { key: 'company', label: t('company') },
    { key: 'age', label: t('age') },
    { key: 'service', label: t('service') }
  ];

  return (
    <UniversalSearchBar
      onSearch={onSearch}
      onSortChange={onSortChange}
      onFilterChange={onFilterChange}
      activeFilters={activeFilters}
      placeholder={t('searchPatient')}
      availableFilters={availableFilters}
    />
  );
};

export default SearchBar;
