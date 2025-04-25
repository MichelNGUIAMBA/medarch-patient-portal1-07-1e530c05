
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/components/ui/sonner"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button"
import { usePatientStore } from '@/stores/usePatientStore';

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit comporter au moins 2 caractères.",
  }),
  company: z.string().min(2, {
    message: "Le nom de l'entreprise doit comporter au moins 2 caractères.",
  }),
  service: z.enum(["VM", "Cons", "Ug"], {
    required_error: "Vous devez sélectionner un service.",
  }),
  birthDate: z.string()
});

type PatientFormData = z.infer<typeof FormSchema>;

const NewPatient = () => {
  const navigate = useNavigate();
  const addPatient = usePatientStore((state) => state.addPatient);
  
  const handleSubmit = (data: PatientFormData) => {
    addPatient({
      name: data.name,
      company: data.company,
      service: data.service as "VM" | "Cons" | "Ug",
      birthDate: data.birthDate
    });
    
    toast.success("Patient enregistré avec succès");
    navigate('/dashboard');
  };

  const form = useForm<PatientFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      company: "",
      service: undefined,
      birthDate: ""
    },
  });

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Enregistrer un nouveau patient</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du patient</FormLabel>
                <FormControl>
                  <Input placeholder="Nom du patient" {...field} />
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
                <FormControl>
                  <Input placeholder="Entreprise" {...field} />
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
                <FormLabel>Service</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un service" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="VM">Visite Médicale</SelectItem>
                    <SelectItem value="Cons">Consultation</SelectItem>
                    <SelectItem value="Ug">Urgence</SelectItem>
                  </SelectContent>
                </Select>
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
          <Button type="submit" className="w-full">Enregistrer le patient</Button>
        </form>
      </Form>
    </div>
  );
};

export default NewPatient;
