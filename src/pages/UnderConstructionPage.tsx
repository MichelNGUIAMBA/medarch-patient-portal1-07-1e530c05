
import React from 'react';
import { FileText } from 'lucide-react';

const UnderConstructionPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <FileText className="h-16 w-16 text-blue-600 mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Page en construction</h2>
      <p className="text-gray-500 max-w-md">
        Cette fonctionnalité est en cours de développement et sera bientôt disponible.
      </p>
    </div>
  );
};

export default UnderConstructionPage;
