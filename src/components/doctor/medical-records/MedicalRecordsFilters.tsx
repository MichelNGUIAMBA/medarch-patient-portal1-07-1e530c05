
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';

interface MedicalRecordsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  companyFilter: string;
  onCompanyFilterChange: (value: string) => void;
  serviceFilter: string;
  onServiceFilterChange: (value: string) => void;
  aiStatusFilter: string;
  onAiStatusFilterChange: (value: string) => void;
  companies: string[];
}

const MedicalRecordsFilters: React.FC<MedicalRecordsFiltersProps> = ({
  searchTerm,
  onSearchChange,
  companyFilter,
  onCompanyFilterChange,
  serviceFilter,
  onServiceFilterChange,
  aiStatusFilter,
  onAiStatusFilterChange,
  companies
}) => {
  const { t } = useLanguage();

  const aiStatuses = [
    { value: 'all', label: 'Tous les statuts', color: 'bg-gray-100' },
    { value: 'to_review', label: 'À réviser', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'normal', label: 'Normal', color: 'bg-green-100 text-green-800' },
    { value: 'potential_emergency', label: 'Urgence potentielle', color: 'bg-red-100 text-red-800' }
  ];

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="relative min-w-[250px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un patient..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Company Filter */}
          <Select value={companyFilter} onValueChange={onCompanyFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Entreprise" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les entreprises</SelectItem>
              {companies.map(company => (
                <SelectItem key={company} value={company}>{company}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Service Filter */}
          <Select value={serviceFilter} onValueChange={onServiceFilterChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les services</SelectItem>
              <SelectItem value="VM">Visite Médicale</SelectItem>
              <SelectItem value="Cons">Consultation</SelectItem>
              <SelectItem value="Ug">Urgence</SelectItem>
            </SelectContent>
          </Select>

          {/* AI Status Filter */}
          <Select value={aiStatusFilter} onValueChange={onAiStatusFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Statut IA" />
            </SelectTrigger>
            <SelectContent>
              {aiStatuses.map(status => (
                <SelectItem key={status.value} value={status.value}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${status.color}`} />
                    {status.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            Filtres Intelligents
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalRecordsFilters;
