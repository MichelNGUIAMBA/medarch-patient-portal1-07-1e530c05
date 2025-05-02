
import React from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth-context";
import { Button } from "@/components/ui/button";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem 
} from "@/components/ui/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { 
  Hospital, 
  User, 
  Users, 
  Database, 
  ClipboardCheck, 
  LogOut, 
  FileText, 
  Calendar, 
  UserCheck, 
  Search,
  MessageSquare,
  Ambulance
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Vous êtes déconnecté");
    navigate("/");
  };

  const getNavigationItems = () => {
    const commonItems = [
      {
        title: "Tableau de bord",
        url: "/dashboard",
        icon: FileText,
      },
    ];

    const roleBasedItems = {
      admin: [
        {
          title: "Gestion utilisateurs",
          url: "/dashboard/users",
          icon: Users,
        },
        {
          title: "Paramètres système",
          url: "/dashboard/settings",
          icon: Database,
        }
      ],
      secretary: [
        {
          title: "Nouveaux patients",
          url: "/dashboard/new-patient",
          icon: User,
        },
        {
          title: "Listes d'attente",
          url: "/dashboard/waiting-lists",
          icon: ClipboardCheck,
        }
      ],
      nurse: [
        {
          title: "Patients en attente",
          url: "/dashboard/waiting-patients",
          icon: Users,
        },
        {
          title: "Visites médicales",
          url: "/dashboard/medical-visits",
          icon: Calendar,
        },
        {
          title: "Consultations",
          url: "/dashboard/consultations",
          icon: MessageSquare,
        },
        {
          title: "Urgences",
          url: "/dashboard/emergencies",
          icon: Ambulance,
        }
      ],
      lab: [
        {
          title: "Examens en attente",
          url: "/dashboard/pending-exams",
          icon: ClipboardCheck,
        },
        {
          title: "Historique d'examens",
          url: "/dashboard/exam-history",
          icon: FileText,
        }
      ],
      doctor: [
        {
          title: "Patients à voir",
          url: "/dashboard/patients-to-see",
          icon: UserCheck,
        },
        {
          title: "Dossiers médicaux",
          url: "/dashboard/medical-records",
          icon: FileText,
        }
      ]
    };

    return user?.role && roleBasedItems[user.role] 
      ? [...commonItems, ...roleBasedItems[user.role]]
      : commonItems;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar className="border-r border-gray-200 bg-white">
          <div className="flex h-16 items-center border-b px-6">
            <Hospital className="h-6 w-6 text-blue-600" />
            <span className="ml-2 text-lg font-semibold text-blue-800">MedArch</span>
          </div>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {getNavigationItems().map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        onClick={() => navigate(item.url)}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel>Votre compte</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-4 py-2">
                  <div className="mb-2 font-medium">{user?.name}</div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {user?.role === "secretary" ? "Secrétaire" : 
                     user?.role === "nurse" ? "Infirmier(e)" :
                     user?.role === "lab" ? "Laboratoire" :
                     user?.role === "doctor" ? "Médecin" : "Administrateur"}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </Button>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 flex items-center border-b px-6 bg-white">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">
                {user?.role === "secretary" ? "Portail de la secrétaire" : 
                 user?.role === "nurse" ? "Portail infirmier" :
                 user?.role === "lab" ? "Portail du laboratoire" :
                 user?.role === "doctor" ? "Portail du médecin" : "Portail administrateur"}
              </h1>
            </div>
            <div className="ml-auto flex items-center">
              <span className="mr-2 text-sm text-muted-foreground">
                Connecté en tant que {user?.name}
              </span>
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
