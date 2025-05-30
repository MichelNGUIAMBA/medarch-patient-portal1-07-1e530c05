
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { router } from './index';
import { RouterProvider } from 'react-router-dom';

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
