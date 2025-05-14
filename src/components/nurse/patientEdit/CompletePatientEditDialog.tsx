
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import ServiceFormSelector from './ServiceFormSelector';

interface CompletePatientEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  serviceOptions?: {
    disabledServices?: Array<"VM" | "Cons" | "Ug">;
    hideDescription?: boolean;
    singleService?: boolean; // Ajouté pour spécifier si on limite à un seul service
  };
}

const CompletePatientEditDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit,
  serviceOptions = {
    disabledServices: [],
    hideDescription: false,
    singleService: true // Par défaut à true pour limiter à un seul service
  }
}: CompletePatientEditDialogProps) => {
  const { t } = useLanguage();
  
  const formSchema = z.object({
    firstName: z.string().min(1, t('required')),
    lastName: z.string().min(1, t('required')),
    birthDate: z.string().min(1, t('required')),
    gender: z.string().min(1, t('required')),
    company: z.string().min(1, t('required')),
    services: serviceOptions.singleService 
      ? z.string() // Un seul service (string)
      : z.array(z.string()).min(1, t('selectAtLeastOne')) // Plusieurs services (array)
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      birthDate: '',
      gender: '',
      company: '',
      services: serviceOptions.singleService ? '' : []
    }
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      // Si un seul service, on le convertit en tableau pour maintenir la compatibilité
      const formattedValues = {
        ...values,
        services: serviceOptions.singleService ? [values.services] : values.services
      };
      
      onSubmit(formattedValues);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(t('errorCreatingPatient'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('completePatientInfo')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('firstName')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('enterFirstName')} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('lastName')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('enterLastName')} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('birthDate')}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('gender')}</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">{t('selectGender')}</option>
                        <option value="male">{t('male')}</option>
                        <option value="female">{t('female')}</option>
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('company')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('enterCompany')} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {/* Utilisation du composant ServiceFormSelector avec l'option singleService */}
            <ServiceFormSelector 
              form={form} 
              disabledServices={serviceOptions.disabledServices || []} 
              hideDescription={serviceOptions.hideDescription}
              singleService={serviceOptions.singleService} 
            />
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t('cancel')}
              </Button>
              <Button type="submit">{t('submit')}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CompletePatientEditDialog;
