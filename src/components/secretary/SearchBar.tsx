
import React from 'react';
import { Search, ArrowUpAZ, ArrowDownAZ, Clock, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
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
  
  const handleFilterChange = (filter: string) => {
    if (activeFilters.includes(filter)) {
      onFilterChange(activeFilters.filter(f => f !== filter));
    } else {
      onFilterChange([...activeFilters, filter]);
    }
  };

  return <div className="p-4 rounded-lg shadow bg-inherit">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input placeholder={t('searchPatient')} className="pl-10" onChange={e => onSearch(e.target.value)} />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{t('filterBy')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked={activeFilters.includes('name')} onCheckedChange={() => handleFilterChange('name')}>
                {t('name')}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={activeFilters.includes('company')} onCheckedChange={() => handleFilterChange('company')}>
                {t('company')}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={activeFilters.includes('age')} onCheckedChange={() => handleFilterChange('age')}>
                {t('age')}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={activeFilters.includes('service')} onCheckedChange={() => handleFilterChange('service')}>
                {t('service')}
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ToggleGroup type="single" onValueChange={onSortChange}>
            <ToggleGroupItem value="alpha-asc" aria-label={t('sortByAlphabeticalAsc')}>
              <ArrowUpAZ className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="alpha-desc" aria-label={t('sortByAlphabeticalDesc')}>
              <ArrowDownAZ className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="time" aria-label={t('sortByArrivalTime')}>
              <Clock className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>;
};

export default SearchBar;
