
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Users, UserPlus, Calendar, ClipboardCheck, Hospital } from 'lucide-react';
import { Button } from '@/components/ui/button';

const QuickActions = () => {
  const navigate = useNavigate();
  
  return (
    <div className="rounded-lg shadow p-6 bg-inherit">
      <h2 className="text-lg font-semibold mb-4">Actions rapides</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard/new-patient')} 
          className="h-auto py-6 flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-colors"
        >
          <UserPlus className="h-8 w-8 text-blue-600 mb-2" />
          <span className="font-medium">Nouveau patient</span>
        </Button>

        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard/search-patient')} 
          className="h-auto py-6 flex flex-col items-center justify-center hover:bg-green-50 hover:border-green-200 transition-colors"
        >
          <Users className="h-8 w-8 text-green-600 mb-2" />
          <span className="font-medium">Rechercher un patient</span>
        </Button>
      </div>
      
      <h3 className="text-md font-semibold mb-3">Ajouter un service</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/medical-visit-type')} 
          className="h-auto py-4 flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-colors"
        >
          <Calendar className="h-6 w-6 text-blue-600 mb-1" />
          <span className="font-medium text-sm">Nouvelle visite médicale</span>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard/new-consultation')} 
          className="h-auto py-4 flex flex-col items-center justify-center hover:bg-green-50 hover:border-green-200 transition-colors"
        >
          <ClipboardCheck className="h-6 w-6 text-green-600 mb-1" />
          <span className="font-medium text-sm">Nouvelle consultation</span>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => navigate('/emergency-forms')} 
          className="h-auto py-4 flex flex-col items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors"
        >
          <Hospital className="h-6 w-6 text-red-600 mb-1" />
          <span className="font-medium text-sm">Nouvelle urgence</span>
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;
