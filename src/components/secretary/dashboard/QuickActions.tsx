
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Users, UserPlus, Calendar, ClipboardCheck, Hospital } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

const QuickActions = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <div className="rounded-lg shadow p-6 bg-card">
      <h2 className="text-lg font-semibold mb-4">{t('quickActions')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard/new-patient')} 
          className="h-auto py-6 flex flex-col items-center justify-center border-border hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <UserPlus className="h-8 w-8 text-primary mb-2" />
          <span className="font-medium">{t('newPatient')}</span>
        </Button>

        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard/search-patient')} 
          className="h-auto py-6 flex flex-col items-center justify-center border-border hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Users className="h-8 w-8 text-primary mb-2" />
          <span className="font-medium">{t('searchPatient')}</span>
        </Button>
      </div>
      
      <h3 className="text-md font-semibold mb-3">{t('addService')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/medical-visit-type')} 
          className="h-auto py-4 flex flex-col items-center justify-center border-border hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-1" />
          <span className="font-medium text-sm">{t('newMedicalVisit')}</span>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => navigate('/new-consultation')} 
          className="h-auto py-4 flex flex-col items-center justify-center border-border hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <ClipboardCheck className="h-6 w-6 text-green-600 dark:text-green-400 mb-1" />
          <span className="font-medium text-sm">{t('newConsultation')}</span>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => navigate('/emergency-forms')} 
          className="h-auto py-4 flex flex-col items-center justify-center border-border hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Hospital className="h-6 w-6 text-red-600 dark:text-red-400 mb-1" />
          <span className="font-medium text-sm">{t('newEmergency')}</span>
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;
