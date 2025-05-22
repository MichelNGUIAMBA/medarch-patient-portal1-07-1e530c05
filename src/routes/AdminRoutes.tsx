
import React from 'react';
import { Route } from 'react-router-dom';
import UserManagement from "@/pages/admin/UserManagement";
import UnderConstructionPage from "@/pages/UnderConstructionPage";

const AdminRoutes = () => {
  return (
    <>
      <Route path="users" element={<UserManagement />} />
      <Route path="settings" element={<UnderConstructionPage />} />
    </>
  );
};

export default AdminRoutes;
