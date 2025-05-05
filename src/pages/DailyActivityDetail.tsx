
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { fr, enUS, de } from 'date-fns/locale';
import { ChevronLeft, Calendar, ClipboardCheck, Hospital, Users, CheckCircle, UserCheck } from 'lucide-react';
import { useDailyActivityStore, Activity } from '@/stores/useDailyActivityStore';
import { usePatientStore } from '@/stores/usePatientStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/hooks/useLanguage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Patient } from '@/types/patient';

const DailyActivityDetail = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { date } = useParams<{ date: string }>();
  const getActivitiesByDate = useDailyActivityStore(state => state.getActivitiesByDate);
  const getStatsByDate = useDailyActivityStore(state => state.getStatsByDate);
  const patients = usePatientStore(state => state.patients);
  
  // Get the correct locale based on the selected language
  const getLocale = () => {
    switch (language) {
      case 'fr':
        return fr;
      case 'de':
        return de;
      case 'en':
      default:
        return enUS;
    }
  };
  
  if (!date) {
    navigate('/dashboard/daily-activities');
    return null;
  }
  
  const activities = getActivitiesByDate(date);
  const stats = getStatsByDate(date);
  
  // Get patients who were active on the selected date
  const dailyPatients = useMemo(() => {
    // Extract patient IDs from activities
    const patientIds = new Set(
      activities
        .filter(activity => activity.patientId)
        .map(activity => activity.patientId)
    );
    
    // Get patient details from patient store
    return patients.filter(patient => patientIds.has(patient.id));
  }, [activities, patients]);
  
  const getActivityTypeIcon = (type: Activity['type']) => {
    switch (type) {
      case 'patient_registration':
        return <Users className="h-4 w-4" />;
      case 'service_assignment':
        return <Hospital className="h-4 w-4" />;
      case 'medical_visit':
      case 'consultation':
        return <ClipboardCheck className="h-4 w-4" />;
      case 'emergency':
        return <Hospital className="h-4 w-4 text-red-500" />;
      case 'lab_exam':
        return <ClipboardCheck className="h-4 w-4 text-purple-500" />;
      case 'status_change':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };
  
  const getActivityTypeColor = (type: Activity['type']) => {
    switch (type) {
      case 'patient_registration':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'service_assignment':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medical_visit':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'consultation':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      case 'emergency':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'lab_exam':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'status_change':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };
  
  const getServiceColor = (service: Patient['service']) => {
    switch (service) {
      case 'VM':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Cons':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Ug':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };
  
  const getStatusColor = (status: Patient['status']) => {
    switch (status) {
      case 'En cours':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Terminé':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Button
        variant="ghost"
        className="mb-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        onClick={() => navigate('/dashboard/daily-activities')}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        {t('backToDailyActivities')}
      </Button>
      
      <h1 className="text-2xl font-bold mb-6">
        {t('activitiesFor')} {format(parseISO(date), 'EEEE d MMMM yyyy', { locale: getLocale() })}
      </h1>
      
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-500 dark:text-gray-400">
                {t('patients')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPatients}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats.newPatients} {t('newPatients')}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-500 dark:text-gray-400">
                {t('medicalVisits')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.medicalVisits}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-500 dark:text-gray-400">
                {t('consultations')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.consultations}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-500 dark:text-gray-400">
                {t('emergencies')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.emergencies}</div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <Tabs defaultValue="activities" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="activities">{t('activityLog')}</TabsTrigger>
          <TabsTrigger value="patients">{t('treatedPatients')}</TabsTrigger>
        </TabsList>
      
        <TabsContent value="activities">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle>{t('activityLog')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('time')}</TableHead>
                    <TableHead>{t('type')}</TableHead>
                    <TableHead>{t('description')}</TableHead>
                    <TableHead>{t('performedBy')}</TableHead>
                    <TableHead>{t('patient')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.length > 0 ? (
                    activities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>
                          {format(parseISO(activity.timestamp), 'HH:mm', { locale: getLocale() })}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActivityTypeColor(activity.type)}`}>
                            {getActivityTypeIcon(activity.type)}
                            <span className="ml-1">{t(activity.type)}</span>
                          </span>
                        </TableCell>
                        <TableCell>{activity.description}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{activity.performedBy.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                              {t(activity.performedBy.role)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {activity.patientName && (
                            <Button
                              variant="link"
                              className="p-0 h-auto font-normal text-blue-600 dark:text-blue-400"
                              onClick={() => navigate(`/dashboard/patient/${activity.patientId}`)}
                            >
                              {activity.patientName}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        {t('noActivitiesRecorded')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="patients">
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle>{t('treatedPatients')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('patientId')}</TableHead>
                    <TableHead>{t('name')}</TableHead>
                    <TableHead>{t('company')}</TableHead>
                    <TableHead>{t('service')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                    <TableHead>{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyPatients.length > 0 ? (
                    dailyPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell>{patient.id}</TableCell>
                        <TableCell className="font-medium uppercase">{patient.name}</TableCell>
                        <TableCell>{patient.company}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getServiceColor(patient.service)}`}>
                            {patient.service}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                            {patient.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                            onClick={() => navigate(`/dashboard/patient/${patient.id}`)}
                          >
                            {t('show')}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        {t('noPatientsRecorded')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DailyActivityDetail;
