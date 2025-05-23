
import React, { useMemo } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth-context";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Hospital, User, Users, Database, ClipboardCheck, LogOut, FileText, Calendar, UserCheck, Search, MessageSquare, Ambulance } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import ThemeSwitcher from "./ThemeSwitcher";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/hooks/useLanguage";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const handleLogout = () => {
    logout();
    toast.success(t('logout'));
    navigate("/");
  };
  
  const navigationItems = useMemo(() => {
    const commonItems = [{
      title: t('dashboard'),
      url: "/dashboard",
      icon: FileText
    }];
    
    const roleBasedItems = {
      admin: [{
        title: t('users'),
        url: "/dashboard/admin/users",
        icon: Users
      }, {
        title: t('settings'),
        url: "/dashboard/admin/settings",
        icon: Database
      }],
      secretary: [{
        title: t('newPatient'),
        url: "/dashboard/secretary/new-patient",
        icon: User
      }, {
        title: t('searchPatient'),
        url: "/dashboard/secretary/search-patient",
        icon: Search
      }, {
        title: t('waitingLists'),
        url: "/dashboard/secretary/waiting-lists",
        icon: ClipboardCheck
      }],
      nurse: [{
        title: t('waitingPatients'),
        url: "/dashboard/nurse/waiting-patients",
        icon: Users
      }, {
        title: t('medicalVisits'),
        url: "/dashboard/nurse/medical-visits",
        icon: Calendar
      }, {
        title: t('consultations'),
        url: "/dashboard/nurse/consultations",
        icon: MessageSquare
      }, {
        title: t('emergencies'),
        url: "/dashboard/nurse/emergencies",
        icon: Ambulance
      }, {
        title: t('exams'),
        url: "/dashboard/nurse/exams",
        icon: ClipboardCheck
      }],
      lab: [{
        title: t('exams'),
        url: "/dashboard/laboratory/exams",
        icon: ClipboardCheck
      }, {
        title: t('examHistory'),
        url: "/dashboard/laboratory/exam-history",
        icon: FileText
      }],
      doctor: [{
        title: t('patientsToSee'),
        url: "/dashboard/doctor/patients-to-see",
        icon: UserCheck
      }, {
        title: t('medicalRecords'),
        url: "/dashboard/doctor/medical-records",
        icon: FileText
      }]
    };
    
    return user?.role && roleBasedItems[user.role] ? [...commonItems, ...roleBasedItems[user.role]] : commonItems;
  }, [t, user?.role]); // Dépendances correctement déclarées
  
  return <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50 dark:bg-gray-900">
        <Sidebar className="border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 dark:text-white">
          <div className="flex h-16 items-center border-b px-6 border-gray-200 dark:border-gray-700">
            <Hospital className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="ml-2 text-lg font-semibold text-blue-800 dark:text-blue-300">MedArch</span>
          </div>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map(item => <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton onClick={() => navigate(item.url)} className="flex items-center gap-3 cursor-pointer">
                        <item.icon className="h-5 w-5" />
                        <span className="text-inherit">{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>)}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel>{t('yourAccount')}</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-4 py-2">
                  <div className="mb-2 font-medium">{user?.name}</div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {user?.role === "secretary" ? t('secretary') : user?.role === "nurse" ? t('nurse') : user?.role === "lab" ? t('lab') : user?.role === "doctor" ? t('doctor') : t('admin')}
                  </div>
                </div>
                <Button variant="ghost" className="w-full justify-start text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 dark:hover:text-red-300" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('logout')}
                </Button>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 flex items-center border-b px-6 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">
                {user?.role === "secretary" ? t('secretaryPortal') : user?.role === "nurse" ? t('nursePortal') : user?.role === "lab" ? t('labPortal') : user?.role === "doctor" ? t('doctorPortal') : t('adminPortal')}
              </h1>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <ThemeSwitcher />
              <LanguageSwitcher />
              <span className="ml-2 text-sm text-muted-foreground">
                {t('takenCareBy')} {user?.name}
              </span>
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto p-6 dark:text rounded-none bg-inherit">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>;
};

export default DashboardLayout;
