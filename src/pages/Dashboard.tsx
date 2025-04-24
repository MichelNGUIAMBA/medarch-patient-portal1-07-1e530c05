import React from 'react';
import { useAuth } from '@/hooks/use-auth-context';
import SecretaryDashboard from './secretary/SecretaryDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  // Render dashboard based on user role
  const renderRoleDashboard = () => {
    switch (user?.role) {
      case 'secretary':
        return <SecretaryDashboard />;
      case 'nurse':
        return <NurseDashboard />;
      case 'lab':
        return <LabDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'doctor':
        return <DoctorDashboard />;
      default:
        return <DefaultDashboard />;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bienvenue, {user?.name}</h1>
      {renderRoleDashboard()}
    </div>
  );
};

const SecretaryDashboard = () => {
  // Mock data
  const waitingListData = {
    vm: 5,
    cons: 8,
    urg: 2,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Patients en attente de VM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-2xl font-bold">{waitingListData.vm}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Patients en attente de consultation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ClipboardCheck className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-2xl font-bold">{waitingListData.cons}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Urgences en cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Hospital className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-2xl font-bold">{waitingListData.urg}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="flex flex-col items-center justify-center p-6 hover:bg-gray-50 cursor-pointer transition-colors">
            <UserCheck className="h-8 w-8 text-blue-600 mb-2" />
            <span className="font-medium">Nouveau patient</span>
          </Card>

          <Card className="flex flex-col items-center justify-center p-6 hover:bg-gray-50 cursor-pointer transition-colors">
            <Users className="h-8 w-8 text-green-600 mb-2" />
            <span className="font-medium">Rechercher un patient</span>
          </Card>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Derniers patients enregistrés</h2>
        </div>
        <div className="p-0">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-medium text-gray-500 bg-gray-50 border-b">
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Nom</th>
                <th className="px-6 py-3 text-left">Entreprise</th>
                <th className="px-6 py-3 text-left">Service</th>
                <th className="px-6 py-3 text-left">Statut</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: "P-1234", name: "Jean Dupont", company: "PERENCO", service: "VM", status: "En attente" },
                { id: "P-1235", name: "Marie Lambert", company: "Total SA", service: "Ug", status: "En cours" },
                { id: "P-1236", name: "Philippe Martin", company: "Dixstone", service: "Cons", status: "En attente" }
              ].map((patient) => (
                <tr key={patient.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{patient.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.service}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      patient.status === "En cours" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">Afficher</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const NurseDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Visites médicales", count: 12, icon: Calendar, color: "blue" },
          { title: "Consultations", count: 8, icon: ClipboardCheck, color: "green" },
          { title: "Urgences", count: 3, icon: Hospital, color: "red" },
          { title: "Patients en attente", count: 23, icon: Users, color: "purple" }
        ].map((item, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <item.icon className={`h-5 w-5 text-${item.color}-600 mr-2`} />
                <span className="text-2xl font-bold">{item.count}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Patients à traiter</h2>
        </div>
        <div className="p-0">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-medium text-gray-500 bg-gray-50 border-b">
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Nom</th>
                <th className="px-6 py-3 text-left">Service</th>
                <th className="px-6 py-3 text-left">Temps d'attente</th>
                <th className="px-6 py-3 text-left">Entreprise</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: "P-1234", name: "Jean Dupont", service: "VM", waitTime: "15 min", company: "PERENCO", priority: "normale" },
                { id: "P-1235", name: "Marie Lambert", service: "Ug", waitTime: "5 min", company: "Total SA", priority: "haute" },
                { id: "P-1236", name: "Philippe Martin", service: "Cons", waitTime: "20 min", company: "Dixstone", priority: "normale" },
                { id: "P-1237", name: "Sarah Dubois", service: "VM", waitTime: "30 min", company: "PERENCO", priority: "normale" }
              ].map((patient) => (
                <tr key={patient.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{patient.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.service}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.waitTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                    <a 
                      href="#" 
                      className={`text-white px-3 py-1 rounded text-xs font-medium ${
                        patient.service === "Ug" 
                          ? "bg-red-600 hover:bg-red-700" 
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      Prendre en charge
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const LabDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Examens en attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ClipboardCheck className="h-5 w-5 text-orange-600 mr-2" />
              <span className="text-2xl font-bold">14</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Examens réalisés aujourd'hui
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ClipboardCheck className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-2xl font-bold">23</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Examens en attente</h2>
        </div>
        <div className="p-0">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-medium text-gray-500 bg-gray-50 border-b">
                <th className="px-6 py-3 text-left">ID Patient</th>
                <th className="px-6 py-3 text-left">Nom</th>
                <th className="px-6 py-3 text-left">Type d'examen</th>
                <th className="px-6 py-3 text-left">Demandé par</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: "P-1234", name: "Jean Dupont", examType: "Analyse de sang", requestedBy: "Dr. Martin", date: "24/04/2023" },
                { id: "P-1235", name: "Marie Lambert", examType: "Test PCR", requestedBy: "Dr. Leroy", date: "24/04/2023" },
                { id: "P-1236", name: "Philippe Martin", examType: "Glycémie", requestedBy: "Dr. Dubois", date: "24/04/2023" },
              ].map((exam) => (
                <tr key={exam.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{exam.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{exam.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{exam.examType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{exam.requestedBy}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{exam.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a href="#" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium">
                      Réaliser
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Utilisateurs actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-2xl font-bold">24</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Entreprises partenaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Hospital className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-2xl font-bold">4</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dossiers ouverts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ClipboardCheck className="h-5 w-5 text-purple-600 mr-2" />
              <span className="text-2xl font-bold">345</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Utilisateurs récents</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {[
                { name: "Jean Dupont", role: "Infirmier", date: "Il y a 2 heures" },
                { name: "Marie Lambert", role: "Secrétaire", date: "Il y a 5 heures" },
                { name: "Dr. Martin", role: "Médecin", date: "Il y a 1 jour" },
              ].map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                      {user.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.role}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{user.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Actions système</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {[
                { action: "Nouveau compte créé", user: "Admin", date: "Il y a 1 heure" },
                { action: "Mise à jour du système", user: "Système", date: "Il y a 1 jour" },
                { action: "Sauvegarde des données", user: "Système", date: "Il y a 2 jours" },
              ].map((log, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <div className="font-medium">{log.action}</div>
                    <div className="text-sm text-gray-500">Par {log.user}</div>
                  </div>
                  <div className="text-sm text-gray-500">{log.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DoctorDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Patients en attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-2xl font-bold">5</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Consultations aujourd'hui
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-2xl font-bold">12</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Urgences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Hospital className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-2xl font-bold">2</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Patients en attente de consultation</h2>
        </div>
        <div className="p-0">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-medium text-gray-500 bg-gray-50 border-b">
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Nom</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Entreprise</th>
                <th className="px-6 py-3 text-left">Temps d'attente</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: "P-1234", name: "Jean Dupont", type: "Cons", company: "PERENCO", waitTime: "15 min" },
                { id: "P-1235", name: "Marie Lambert", type: "Ug", company: "Total SA", waitTime: "5 min" },
                { id: "P-1236", name: "Philippe Martin", type: "Cons", company: "Dixstone", waitTime: "20 min" },
              ].map((patient) => (
                <tr key={patient.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{patient.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      patient.type === "Ug" 
                        ? "bg-red-100 text-red-800" 
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {patient.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.waitTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a 
                      href="#" 
                      className={`text-white px-3 py-1 rounded text-xs font-medium ${
                        patient.type === "Ug" 
                          ? "bg-red-600 hover:bg-red-700" 
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      Consulter
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const DefaultDashboard = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-muted-foreground">Bienvenue dans le système MedArch</p>
    </div>
  );
};

export default Dashboard;
