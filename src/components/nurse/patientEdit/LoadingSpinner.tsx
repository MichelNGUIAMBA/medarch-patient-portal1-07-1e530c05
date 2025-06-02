
import React from 'react';
import { Heart } from 'lucide-react';

export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Heart className="h-10 w-10 text-primary animate-pulse" />
      <p className="text-sm text-muted-foreground mt-2">Chargement des données médicales...</p>
    </div>
  );
};
