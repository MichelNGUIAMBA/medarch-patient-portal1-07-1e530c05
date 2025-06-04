
import React from 'react';
import { useSupabaseLab } from '@/hooks/useSupabaseLab';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TestTube, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import StatsCard from '@/components/shared/StatsCard';

const LabDashboard = () => {
  const { pendingExams, completedExams, loading } = useSupabaseLab();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'normal': return 'bg-blue-500';
      case 'low': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  const urgentExamsCount = pendingExams.filter(exam => exam.priority === 'urgent').length;
  const completionRate = pendingExams.length + completedExams.length > 0 
    ? Math.round((completedExams.length / (pendingExams.length + completedExams.length)) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Examens en attente"
          value={pendingExams.length}
          icon={Clock}
          iconColor="text-orange-600"
        />
        
        <StatsCard
          title="Examens urgents"
          value={urgentExamsCount}
          icon={AlertCircle}
          iconColor="text-red-600"
        />
        
        <StatsCard
          title="Examens complétés"
          value={completedExams.length}
          icon={CheckCircle}
          iconColor="text-green-600"
        />
        
        <StatsCard
          title="Efficacité"
          value={`${completionRate}%`}
          icon={TestTube}
          iconColor="text-blue-600"
        />
      </div>

      {/* Pending Exams */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Examens en attente
          </CardTitle>
          <CardDescription>
            Liste des examens à effectuer par ordre de priorité
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingExams.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucun examen en attente
            </p>
          ) : (
            <div className="space-y-4">
              {pendingExams.map((exam) => (
                <div key={exam.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`${getPriorityColor(exam.priority)} text-white`}>
                          {exam.priority}
                        </Badge>
                        <span className="font-medium">{exam.exam_name}</span>
                        <span className="text-sm text-muted-foreground">({exam.exam_type})</span>
                      </div>
                      <p className="text-sm">
                        <strong>Patient:</strong> {exam.patients?.name} 
                        {exam.patients?.companies?.name && (
                          <span className="text-muted-foreground"> - {exam.patients?.companies?.name}</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Demandé par: {exam.requester?.name} - {new Date(exam.requested_at).toLocaleString()}
                      </p>
                    </div>
                    <Button size="sm">
                      Traiter
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Completed Exams */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Examens récemment complétés
          </CardTitle>
          <CardDescription>
            Derniers examens terminés
          </CardDescription>
        </CardHeader>
        <CardContent>
          {completedExams.slice(0, 5).length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucun examen complété récemment
            </p>
          ) : (
            <div className="space-y-4">
              {completedExams.slice(0, 5).map((exam) => (
                <div key={exam.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Complété
                        </Badge>
                        <span className="font-medium">{exam.exam_name}</span>
                      </div>
                      <p className="text-sm">
                        <strong>Patient:</strong> {exam.patients?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Complété le: {exam.completed_at ? new Date(exam.completed_at).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Voir résultats
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LabDashboard;
