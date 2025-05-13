
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Patient } from '@/types/patient';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ModificationHistoryTableProps {
  patient: Patient;
}

const ModificationHistoryTable = ({ patient }: ModificationHistoryTableProps) => {
  if (!patient.modificationHistory || patient.modificationHistory.length === 0) {
    return null;
  }
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Historique des modifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">Champ</th>
                <th className="text-left py-2 px-4">Ancienne valeur</th>
                <th className="text-left py-2 px-4">Nouvelle valeur</th>
                <th className="text-left py-2 px-4">Modifié par</th>
                <th className="text-left py-2 px-4">Date et heure</th>
              </tr>
            </thead>
            <tbody>
              {patient.modificationHistory.map((record, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{record.field}</td>
                  <td className="py-2 px-4">{record.oldValue}</td>
                  <td className="py-2 px-4">{record.newValue}</td>
                  <td className="py-2 px-4">
                    {record.modifiedBy.name} ({record.modifiedBy.role})
                  </td>
                  <td className="py-2 px-4">
                    {format(new Date(record.timestamp), "d MMM yyyy HH:mm", { locale: fr })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModificationHistoryTable;
