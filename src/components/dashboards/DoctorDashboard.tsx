
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Calendar, Hospital } from 'lucide-react';

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

export default DoctorDashboard;
