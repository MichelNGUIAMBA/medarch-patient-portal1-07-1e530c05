
import React from 'react';
import { z } from 'zod';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLanguage } from '@/hooks/useLanguage';

export type Service = "VM" | "Cons" | "Ug";

interface ServiceFormSelectorProps {
  form: any;
  disabledServices?: Service[];
  hideDescription?: boolean;
  singleService?: boolean; // Ajout de cette prop pour indiquer si on limite à un seul service
}

const ServiceFormSelector = ({ 
  form, 
  disabledServices = [],
  hideDescription = false,
  singleService = false // Par défaut à false pour maintenir la compatibilité avec l'existant
}: ServiceFormSelectorProps) => {
  const { t } = useLanguage();
  
  const serviceSchema = singleService 
    ? z.string().refine(val => ["VM", "Cons", "Ug"].includes(val)) // Pour un seul service
    : z.array(z.string()).refine(val => val.length > 0, { message: t('selectAtLeastOne') }); // Pour plusieurs services

  return (
    <FormField
      control={form.control}
      name="services"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('requiredServices')}</FormLabel>
          {singleService ? (
            // Affichage pour un seul service (RadioGroup)
            <FormControl>
              <RadioGroup
                value={field.value || ""}
                onValueChange={(value) => field.onChange(value)}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="VM" disabled={disabledServices.includes("VM")} />
                  </FormControl>
                  <FormLabel className="font-normal">{t('medicalVisit')}</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="Cons" disabled={disabledServices.includes("Cons")} />
                  </FormControl>
                  <FormLabel className="font-normal">{t('consultation')}</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="Ug" disabled={disabledServices.includes("Ug")} />
                  </FormControl>
                  <FormLabel className="font-normal">{t('emergency')}</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
          ) : (
            // Affichage pour plusieurs services (Checkboxes)
            <FormControl>
              <div className="flex flex-col space-y-2">
                {[
                  { value: "VM", label: t('medicalVisit') },
                  { value: "Cons", label: t('consultation') },
                  { value: "Ug", label: t('emergency') }
                ].map((service) => (
                  <div key={service.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      disabled={disabledServices.includes(service.value as Service)}
                      id={`service-${service.value}`}
                      checked={field.value?.includes(service.value) || false}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const currentValue = field.value || [];
                        
                        const updatedValue = checked
                          ? [...currentValue, service.value]
                          : currentValue.filter((val: string) => val !== service.value);
                        
                        field.onChange(updatedValue);
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor={`service-${service.value}`} className="text-sm font-medium">
                      {service.label}
                    </label>
                  </div>
                ))}
              </div>
            </FormControl>
          )}
          {!hideDescription && (
            <FormDescription>
              {t('selectServicesForPatient')}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ServiceFormSelector;
