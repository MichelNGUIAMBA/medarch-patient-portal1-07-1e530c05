
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Hospital } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="text-center max-w-md px-4">
        <Hospital className="h-16 w-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-blue-800 mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-4">{t('pageNotFound')}</h2>
        <p className="text-gray-600 mb-8">
          {t('pageNotFoundMessage')}
        </p>
        <Button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2"
        >
          {t('goBack')}
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
