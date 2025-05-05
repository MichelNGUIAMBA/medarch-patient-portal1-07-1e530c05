
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Users, Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

const QuickActions = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <div className="rounded-lg shadow p-6 bg-white dark:bg-gray-800">
      <h2 className="text-lg font-semibold mb-4 dark:text-white">{t('quickActions')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard/new-patient')} 
          className="h-auto py-6 flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/30 dark:hover:border-blue-700 transition-colors"
        >
          <UserCheck className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
          <span className="font-medium">{t('newPatient')}</span>
        </Button>

        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard/search-patient')} 
          className="h-auto py-6 flex flex-col items-center justify-center hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-900/30 dark:hover:border-green-700 transition-colors"
        >
          <Users className="h-8 w-8 text-green-600 dark:text-green-400 mb-2" />
          <span className="font-medium">{t('searchPatient')}</span>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard/new-day')} 
          className="h-auto py-6 flex flex-col items-center justify-center hover:bg-purple-50 hover:border-purple-200 dark:hover:bg-purple-900/30 dark:hover:border-purple-700 transition-colors"
        >
          <Calendar className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-2" />
          <Plus className="h-4 w-4 absolute top-3 right-3 text-purple-600 dark:text-purple-400" />
          <span className="font-medium">{t('newDay')}</span>
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;
