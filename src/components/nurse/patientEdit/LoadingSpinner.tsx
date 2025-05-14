
import React from 'react';

export const LoadingSpinner = () => {
  return (
    <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
    </div>
  );
};
