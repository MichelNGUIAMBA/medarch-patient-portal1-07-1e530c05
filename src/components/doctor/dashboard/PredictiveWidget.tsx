
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, AlertTriangle, Calendar } from 'lucide-react';
import { usePatientStore } from '@/stores/patient';

const PredictiveWidget: React.FC = () => {
  const patients = usePatientStore((state) => state.patients);

  // Generate predictive workload data
  const workloadData = useMemo(() => {
    const today = new Date();
    const data = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Simulate predictive algorithm
      const baseLoad = 15 + Math.sin(i * 0.5) * 5;
      const randomVariation = (Math.random() - 0.5) * 4;
      const predicted = Math.max(5, Math.round(baseLoad + randomVariation));
      
      data.push({
        date: date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
        predicted,
        historical: i < 3 ? predicted - 2 + Math.random() * 4 : null
      });
    }
    
    return data;
  }, []);

  // Emergency heatmap data
  const emergencyHeatmap = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const companies = ['PERENCO', 'Total SA', 'Dixstone'];
    
    return hours.map(hour => ({
      hour: `${hour}h`,
      PERENCO: Math.floor(Math.random() * 5),
      'Total SA': Math.floor(Math.random() * 3),
      Dixstone: Math.floor(Math.random() * 4)
    }));
  }, []);

  // Pathology distribution
  const pathologyData = useMemo(() => {
    return [
      { pathology: 'Troubles MSK', PERENCO: 35, 'Total SA': 20, Dixstone: 28 },
      { pathology: 'Hypertension', PERENCO: 25, 'Total SA': 30, Dixstone: 15 },
      { pathology: 'Diabète', PERENCO: 15, 'Total SA': 25, Dixstone: 20 },
      { pathology: 'Troubles visuels', PERENCO: 12, 'Total SA': 8, Dixstone: 18 },
      { pathology: 'Stress professionnel', PERENCO: 8, 'Total SA': 12, Dixstone: 25 }
    ];
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Predictive Workload */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Courbe Prédictive de Charge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={workloadData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="historical" 
                stroke="#8884d8" 
                strokeDasharray="5 5"
                name="Historique"
              />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#82ca9d" 
                strokeWidth={2}
                name="Prédiction IA"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Emergency Heatmap Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Urgences par Heure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>8h-12h (pic)</span>
              <span className="font-semibold text-red-600">12 urgences</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>13h-17h</span>
              <span className="font-semibold text-yellow-600">8 urgences</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>18h-22h</span>
              <span className="font-semibold text-green-600">3 urgences</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Alerte:</strong> Augmentation de 40% des troubles MSK chez Dixstone ce mois
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pathology Distribution */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Pathologies Dominantes par Entreprise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={pathologyData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="pathology" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="PERENCO" fill="#8884d8" name="PERENCO" />
              <Bar dataKey="Total SA" fill="#82ca9d" name="Total SA" />
              <Bar dataKey="Dixstone" fill="#ffc658" name="Dixstone" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveWidget;
