
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ClipboardCheck } from 'lucide-react';

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

export default LabDashboard;
