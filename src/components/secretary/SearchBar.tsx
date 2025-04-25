
import React from 'react';
import { Search, ArrowUpAZ, ArrowDownAZ, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface SearchBarProps {
  onSearch: (value: string) => void;
  onSortChange: (value: string) => void;
}

const SearchBar = ({ onSearch, onSortChange }: SearchBarProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un patient..."
            className="pl-10"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
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
  );
};

export default SearchBar;
