
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Search } from 'lucide-react';

interface CIM11Code {
  code: string;
  title: string;
  category: string;
}

interface CIM11AutoCompleteProps {
  value: string[];
  onChange: (codes: string[]) => void;
  placeholder?: string;
}

// Simulation de la base CIM-11
const mockCIM11Database: CIM11Code[] = [
  { code: "8A80", title: "Hypertension artérielle essentielle", category: "Maladies du système circulatoire" },
  { code: "5A11", title: "Diabète sucré de type 2", category: "Maladies endocriniennes" },
  { code: "FA20", title: "Troubles anxieux généralisés", category: "Troubles mentaux" },
  { code: "CA40", title: "Bronchite chronique obstructive", category: "Maladies du système respiratoire" },
  { code: "FB80", title: "Lombalgie chronique", category: "Troubles musculo-squelettiques" },
  { code: "8A81", title: "Hypertension artérielle secondaire", category: "Maladies du système circulatoire" },
  { code: "5A10", title: "Diabète sucré de type 1", category: "Maladies endocriniennes" },
  { code: "CA00", title: "Asthme bronchique", category: "Maladies du système respiratoire" },
  { code: "FB40", title: "Arthrose du genou", category: "Troubles musculo-squelettiques" },
  { code: "DA80", title: "Gastrite chronique", category: "Maladies du système digestif" },
  { code: "GB90", title: "Insuffisance rénale chronique", category: "Maladies du système génito-urinaire" },
  { code: "BA00", title: "Anémie ferriprive", category: "Maladies du sang" },
  { code: "8A70", title: "Fibrillation auriculaire", category: "Maladies du système circulatoire" },
  { code: "FA40", title: "Troubles dépressifs majeurs", category: "Troubles mentaux" },
  { code: "EE10", title: "Hypothyroïdie", category: "Maladies endocriniennes" }
];

const CIM11AutoComplete: React.FC<CIM11AutoCompleteProps> = ({
  value,
  onChange,
  placeholder = "Rechercher un diagnostic CIM-11..."
}) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<CIM11Code[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const filtered = mockCIM11Database.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 10);
      setSuggestions(filtered);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: CIM11Code) => {
    const newCode = `${code.code} - ${code.title}`;
    if (!value.includes(newCode)) {
      onChange([...value, newCode]);
    }
    setSearchTerm('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleRemove = (codeToRemove: string) => {
    onChange(value.filter(code => code !== codeToRemove));
  };

  return (
    <div className="space-y-2">
      {/* Codes sélectionnés */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((code, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              <span className="text-xs">{code}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleRemove(code)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Champ de recherche */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm.length >= 2 && setIsOpen(true)}
            className="pl-8"
          />
        </div>

        {/* Dropdown des suggestions */}
        {isOpen && suggestions.length > 0 && (
          <Card 
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto"
          >
            <CardContent className="p-0">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 cursor-pointer hover:bg-muted border-b last:border-b-0"
                  onClick={() => handleSelect(suggestion)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        <span className="text-primary font-mono">{suggestion.code}</span>
                        {' - '}
                        <span>{suggestion.title}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {suggestion.category}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {isOpen && searchTerm.length >= 2 && suggestions.length === 0 && (
          <Card className="absolute z-50 w-full mt-1">
            <CardContent className="p-3 text-center text-sm text-muted-foreground">
              {t('noResultsFound')}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CIM11AutoComplete;
