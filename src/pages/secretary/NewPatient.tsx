
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePatientStore } from '@/stores/usePatientStore';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';
import CsvImport from '@/components/secretary/CsvImport';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth-context';
import ExistingPatientDialog from '@/components/secretary/ExistingPatientDialog';

const formSchema = z.object({
  firstName: z.string().min(2, { message: 'Le prénom doit contenir au moins 2 caractères.' }),
  lastName: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères.' }),
  gender: z.enum(['M', 'F'], { required_error: 'Veuillez sélectionner le genre.' }),
  birthDate: z.string().min(1, { message: 'Veuillez entrer la date de naissance.' }),
  company: z.string().min(1, { message: 'Veuillez sélectionner une entreprise.' }),
  employeeId: z.string().optional(),
  service: z.enum(['VM', 'Cons', 'Ug'], { required_error: 'Veuillez sélectionner un service.' }),
  phone: z.string().optional(),
  email: z.string().email({ message: 'Email invalide.' }).optional().or(z.literal('')),
  address: z.string().optional(),
  idNumber: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const NewPatientPage = () => {
  const navigate = useNavigate();
  const addPatient = usePatientStore((state) => state.addPatient);
  const { user } = useAuth();
  const [isExistingPatientDialogOpen, setIsExistingPatientDialogOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      gender: 'M',
      birthDate: '',
      company: '',
      employeeId: '',
      service: 'VM',
      phone: '',
      email: '',
      address: '',
      idNumber: '',
    },
  });

  const handleSubmit = (data: FormValues) => {
    if (!user) {
      toast.error("Vous devez être connecté pour ajouter un patient.");
      return;
    }

    addPatient(data);
    toast.success('Patient ajouté avec succès!');
    navigate('/dashboard/waiting-lists');
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Enregistrement d'un nouveau patient</h1>
      
      <div className="flex justify-between mb-6">
        <Button onClick={() => setIsExistingPatientDialogOpen(true)}>
          Patient existant
        </Button>
      </div>

      <Tabs defaultValue="form" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="form">Formulaire manuel</TabsTrigger>
          <TabsTrigger value="import">Import CSV</TabsTrigger>
        </TabsList>
        
        <TabsContent value="form">
          <Card>
            <CardHeader>
              <CardTitle>Informations du patient</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prénom</FormLabel>
                          <FormControl>
                            <Input placeholder="Prénom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom</FormLabel>
                          <FormControl>
                            <Input placeholder="Nom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Genre</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex space-x-4"
                            >
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="M" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  Masculin
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="F" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  Féminin
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="birthDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de naissance</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Entreprise</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une entreprise" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="PERENCO">PERENCO</SelectItem>
                              <SelectItem value="Total SA">Total SA</SelectItem>
                              <SelectItem value="Dixstone">Dixstone</SelectItem>
                              <SelectItem value="Autre">Autre société</SelectItem>
                              <SelectItem value="Stagiaire">Stagiaire</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="employeeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numéro d'employé</FormLabel>
                          <FormControl>
                            <Input placeholder="Numéro d'employé" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="service"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service requis</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez un service" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="VM">Visite Médicale (VM)</SelectItem>
                              <SelectItem value="Cons">Consultation (Cons)</SelectItem>
                              <SelectItem value="Ug">Urgence (Ug)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input placeholder="Numéro de téléphone" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adresse</FormLabel>
                          <FormControl>
                            <Input placeholder="Adresse" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="idNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numéro d'identité</FormLabel>
                          <FormControl>
                            <Input placeholder="Numéro d'identité" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                      Annuler
                    </Button>
                    <Button type="submit">Enregistrer le patient</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>Import CSV de patients</CardTitle>
            </CardHeader>
            <CardContent>
              <CsvImport />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialog pour ajouter un patient existant */}
      <ExistingPatientDialog 
        isOpen={isExistingPatientDialogOpen}
        onClose={() => setIsExistingPatientDialogOpen(false)}
      />
    </div>
  );
};

export default NewPatientPage;
