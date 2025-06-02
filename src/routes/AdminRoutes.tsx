
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserManagement from "@/pages/admin/UserManagement";
import Settings from "@/pages/admin/Settings";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="users" element={<UserManagement />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  );
};

export default AdminRoutes;
