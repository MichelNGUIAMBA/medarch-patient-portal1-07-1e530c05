
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { ClipboardCheck, Search, FileText, Check, X } from "lucide-react";

const LabExams = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [results, setResults] = useState("");

  // Mock data for pending exams
  const pendingExams = [
    {
      id: "E-1001",
      patientId: "P-1234",
      patientName: "Jean Dupont",
      examType: "Analyse de sang",
      reqDate: "2025-04-23",
      requestedBy: "Dr. Martin",
      company: "PERENCO",
      priority: "normal"
    },
    {
      id: "E-1002",
      patientId: "P-1235",
      patientName: "Marie Lambert",
      examType: "Test PCR",
      reqDate: "2025-04-23",
      requestedBy: "Dr. Leroy",
      company: "Total SA",
      priority: "high"
    },
    {
      id: "E-1003",
      patientId: "P-1236",
      patientName: "Philippe Martin",
      examType: "Glycémie",
      reqDate: "2025-04-23",
      requestedBy: "Dr. Dubois",
      company: "Dixstone",
      priority: "normal"
    },
    {
      id: "E-1004",
      patientId: "P-1237",
      patientName: "Sarah Dubois",
      examType: "Groupe sanguin",
      reqDate: "2025-04-23",
      requestedBy: "Dr. Martin",
      company: "PERENCO",
      priority: "normal"
    },
    {
      id: "E-1005",
      patientId: "P-1238",
      patientName: "Lucas Richard",
      examType: "Analyse d'urine",
      reqDate: "2025-04-22",
      requestedBy: "Dr. Leroy",
      company: "Dixstone",
      priority: "normal"
    }
  ];

  // Mock data for completed exams
  const completedExams = [
    {
      id: "E-0998",
      patientId: "P-1230",
      patientName: "Thomas Petit",
      examType: "Analyse de sang",
      reqDate: "2025-04-21",
      completedDate: "2025-04-21",
      requestedBy: "Dr. Martin",
      company: "PERENCO",
    },
    {
      id: "E-0999",
      patientId: "P-1231",
      patientName: "Emma Leclerc",
      examType: "Test PCR",
      reqDate: "2025-04-21",
      completedDate: "2025-04-22",
      requestedBy: "Dr. Dubois",
      company: "Total SA",
    },
    {
      id: "E-1000",
      patientId: "P-1232",
      patientName: "Paul Moreau",
      examType: "Glycémie",
      reqDate: "2025-04-20",
      completedDate: "2025-04-21",
      requestedBy: "Dr. Leroy",
      company: "Dixstone",
    }
  ];

  // Filter exams based on search term
  const filteredPendingExams = pendingExams.filter(exam => 
    exam.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.examType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCompletedExams = completedExams.filter(exam => 
    exam.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.examType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExamSelect = (exam: any) => {
    setSelectedExam(exam);
    setIsDialogOpen(true);
    setResults("");
  };

  const handleSaveResults = () => {
    if (!results.trim()) {
      toast.error("Veuillez saisir les résultats de l'examen");
      return;
    }
    
    toast.success("Résultats enregistrés avec succès");
    setIsDialogOpen(false);
    // In a real application, this would update the database
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Examens de laboratoire</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center">
            <ClipboardCheck className="mr-2 h-4 w-4" />
            En attente ({pendingExams.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Complétés ({completedExams.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Examens en attente</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Type d'examen</TableHead>
                    <TableHead>Date demandée</TableHead>
                    <TableHead>Demandé par</TableHead>
                    <TableHead>Entreprise</TableHead>
                    <TableHead>Priorité</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPendingExams.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground">
                        Aucun examen en attente trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPendingExams.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell>{exam.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{exam.patientName}</p>
                            <p className="text-xs text-muted-foreground">{exam.patientId}</p>
                          </div>
                        </TableCell>
                        <TableCell>{exam.examType}</TableCell>
                        <TableCell>{new Date(exam.reqDate).toLocaleDateString()}</TableCell>
                        <TableCell>{exam.requestedBy}</TableCell>
                        <TableCell>{exam.company}</TableCell>
                        <TableCell>
                          <Badge variant={exam.priority === 'high' ? 'destructive' : 'secondary'}>
                            {exam.priority === 'high' ? 'Urgent' : 'Normal'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            onClick={() => handleExamSelect(exam)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Réaliser
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Examens complétés</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Type d'examen</TableHead>
                    <TableHead>Date demandée</TableHead>
                    <TableHead>Date réalisée</TableHead>
                    <TableHead>Demandé par</TableHead>
                    <TableHead>Entreprise</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompletedExams.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground">
                        Aucun examen complété trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCompletedExams.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell>{exam.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{exam.patientName}</p>
                            <p className="text-xs text-muted-foreground">{exam.patientId}</p>
                          </div>
                        </TableCell>
                        <TableCell>{exam.examType}</TableCell>
                        <TableCell>{new Date(exam.reqDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(exam.completedDate).toLocaleDateString()}</TableCell>
                        <TableCell>{exam.requestedBy}</TableCell>
                        <TableCell>{exam.company}</TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleExamSelect({ ...exam, completed: true })}
                          >
                            Voir résultats
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog for entering exam results */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {selectedExam?.completed ? (
                <>
                  <FileText className="mr-2 h-5 w-5 text-green-600" />
                  Résultats d'examen
                </>
              ) : (
                <>
                  <ClipboardCheck className="mr-2 h-5 w-5 text-blue-600" />
                  Saisir les résultats d'examen
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedExam?.examType} pour {selectedExam?.patientName} ({selectedExam?.patientId})
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Demandé par</Label>
                <p>{selectedExam?.requestedBy}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Date demandée</Label>
                <p>{selectedExam?.reqDate && new Date(selectedExam.reqDate).toLocaleDateString()}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Entreprise</Label>
                <p>{selectedExam?.company}</p>
              </div>
              {selectedExam?.completed && (
                <div>
                  <Label className="text-muted-foreground">Date réalisée</Label>
                  <p>{selectedExam?.completedDate && new Date(selectedExam.completedDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="results">{selectedExam?.completed ? "Résultats" : "Saisir les résultats"}</Label>
              <Textarea
                id="results"
                value={results}
                onChange={(e) => setResults(e.target.value)}
                placeholder="Saisissez les résultats de l'examen ici..."
                rows={6}
                disabled={selectedExam?.completed}
                className={selectedExam?.completed ? "bg-gray-50" : ""}
              />
              {selectedExam?.completed && (
                <p className="text-sm text-muted-foreground mt-2">
                  (Les résultats sont enregistrés et ne peuvent plus être modifiés)
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="gap-1">
              <X className="h-4 w-4" />
              {selectedExam?.completed ? "Fermer" : "Annuler"}
            </Button>
            {!selectedExam?.completed && (
              <Button onClick={handleSaveResults} className="gap-1 bg-green-600 hover:bg-green-700">
                <Check className="h-4 w-4" />
                Enregistrer les résultats
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LabExams;
