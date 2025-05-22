
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserManagement from "@/pages/admin/UserManagement";
import UnderConstructionPage from "@/pages/UnderConstructionPage";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="users" element={<UserManagement />} />
      <Route path="settings" element={<UnderConstructionPage />} />
    </Routes>
  );
};

export default AdminRoutes;
