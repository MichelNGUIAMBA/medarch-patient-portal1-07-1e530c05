
import React from 'react';
import { Search, ArrowUpAZ, ArrowDownAZ, Clock, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { useLanguage } from '@/hooks/useLanguage';

interface UniversalSearchBarProps {
  onSearch: (value: string) => void;
  onSortChange: (value: string) => void;
  onFilterChange: (filters: string[]) => void;
  activeFilters: string[];
  placeholder?: string;
  availableFilters?: Array<{key: string, label: string}>;
}

const UniversalSearchBar = ({
  onSearch,
  onSortChange,
  onFilterChange,
  activeFilters,
  placeholder = "Rechercher...",
  availableFilters = [
    { key: 'name', label: 'Nom' },
    { key: 'company', label: 'Société' },
    { key: 'age', label: 'Âge' },
    { key: 'service', label: 'Service' }
  ]
}: UniversalSearchBarProps) => {
  const { t } = useLanguage();
  
  const handleFilterToggle = (filterKey: string) => {
    const newFilters = activeFilters.includes(filterKey)
      ? activeFilters.filter(f => f !== filterKey)
      : [...activeFilters, filterKey];
    onFilterChange(newFilters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="p-4 rounded-lg shadow bg-inherit">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            placeholder={placeholder} 
            className="pl-10" 
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuLabel>Filtrer par</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {availableFilters.map((filter) => (
                <DropdownMenuCheckboxItem 
                  key={filter.key}
                  checked={activeFilters.includes(filter.key)} 
                  onCheckedChange={() => handleFilterToggle(filter.key)}
                >
                  {filter.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <ToggleGroup type="single" onValueChange={onSortChange}>
            <ToggleGroupItem value="alpha-asc" aria-label="Trier par ordre alphabétique croissant">
              <ArrowUpAZ className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="alpha-desc" aria-label="Trier par ordre alphabétique décroissant">
              <ArrowDownAZ className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="time" aria-label="Trier par heure d'arrivée">
              <Clock className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
};

export default UniversalSearchBar;
