
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { fr, enUS, de } from 'date-fns/locale';
import { Archive, Plus } from 'lucide-react';
import { useDailyActivityStore } from '@/stores/useDailyActivityStore';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

const DailyActivities = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const getDates = useDailyActivityStore(state => state.getDates);
  const dates = getDates();
  
  // Get the correct locale based on the selected language
  const getLocale = () => {
    switch (language) {
      case 'fr':
        return fr;
      case 'de':
        return de;
      case 'en':
      default:
        return enUS;
    }
  };
  
  const navigateToDateDetail = (date: string) => {
    navigate(`/dashboard/daily-activities/${date}`);
  };

  const navigateToNewDay = () => {
    navigate('/dashboard/new-day');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('dailyActivities')}</h1>
        <Button 
          onClick={navigateToNewDay}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4" />
          {t('newDay')}
        </Button>
      </div>
      
      {dates.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">{t('noActivitiesYet')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {dates.map(date => (
            <Button
              key={date}
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors rounded-lg shadow"
              onClick={() => navigateToDateDetail(date)}
            >
              <Archive className="h-16 w-16 text-blue-600 dark:text-blue-400 mb-4" />
              <span className="font-medium text-lg">
                {format(parseISO(date), 'EEEE d MMMM yyyy', { locale: getLocale() })}
              </span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyActivities;
