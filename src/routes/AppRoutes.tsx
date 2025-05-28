
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './index';

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
