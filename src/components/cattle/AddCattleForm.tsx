
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

import { cattleFormSchema, type CattleFormValues } from "./form/cattleFormSchema";
import { calculateAge } from "./form/cattleUtils";
import { FormActions } from "./form/FormActions";
import {
  EarTagIdField,
  NameField,
  BreedField,
  CoatColorField,
  CategoryField,
  GenderField,
  BirthDateField,
  FarmEntryDateField,
  BirthSeasonField,
  WeightField,
  StatusField,
  ObservationsField,
} from "./form/FormFields";

interface AddCattleFormProps {
  onSuccess: (animal?: any) => void;
  onCancel: () => void;
  initialData?: any;
  isEditing?: boolean;
}

export function AddCattleForm({ 
  onSuccess, 
  onCancel, 
  initialData, 
  isEditing = false 
}: AddCattleFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CattleFormValues>({
    resolver: zodResolver(cattleFormSchema),
    defaultValues: {
      earTagId: "",
      name: "",
      breed: "",
      coatColor: "",
      category: "",
      birthSeason: "",
      weight: "",
      gender: "",
      status: "Saudável",
      observations: "",
      farmEntryDate: new Date(), // Default to today
    },
  });

  // Populate the form with initial data if editing
  useEffect(() => {
    if (initialData && isEditing) {
      form.reset({
        earTagId: initialData.id || "",
        name: initialData.name || "",
        breed: initialData.type || "",
        coatColor: initialData.coatColor || "",
        category: initialData.category || "Boi",
        birthDate: initialData.lastCheck || new Date(),
        farmEntryDate: initialData.farmEntryDate || new Date(),
        birthSeason: initialData.birthSeason || "",
        weight: initialData.weight?.toString() || "",
        gender: initialData.gender || "",
        status: initialData.status || "Saudável",
        observations: initialData.observations || "",
      });
    }
  }, [initialData, isEditing, form]);

  const onSubmit = (data: CattleFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Submitted cattle data:", data);
      
      // Update the current cattle data if editing
      if (isEditing && initialData) {
        initialData.id = data.earTagId;
        initialData.name = data.name;
        initialData.type = data.breed;
        initialData.coatColor = data.coatColor;
        initialData.age = calculateAge(data.birthDate);
        initialData.weight = parseFloat(data.weight);
        initialData.status = data.status;
        initialData.gender = data.gender;
        initialData.lastCheck = data.birthDate;
        initialData.farmEntryDate = data.farmEntryDate;
        initialData.birthSeason = data.birthSeason;
        initialData.observations = data.observations;
      }

      // Criar objeto animal com os dados do formulário
      const animalData = {
        id: data.earTagId,
        name: data.name,
        type: data.breed,
        coatColor: data.coatColor,
        age: calculateAge(data.birthDate),
        weight: parseFloat(data.weight),
        status: data.status,
        gender: data.gender,
        lastCheck: data.birthDate,
        farmEntryDate: data.farmEntryDate,
        birthSeason: data.birthSeason,
        observations: data.observations,
        category: data.category
      };

      toast({
        title: isEditing ? "Animal atualizado com sucesso" : "Animal adicionado com sucesso",
        description: `ID: ${data.earTagId}`,
      });
      
      setIsSubmitting(false);
      onSuccess(animalData);
    }, 1000);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <EarTagIdField control={form.control} />
        <NameField control={form.control} />
        <BreedField control={form.control} />
        <CoatColorField control={form.control} />
        <CategoryField control={form.control} />
        <GenderField control={form.control} />
        <BirthDateField control={form.control} />
        <FarmEntryDateField control={form.control} />
        <BirthSeasonField control={form.control} />
        <WeightField control={form.control} />
        <StatusField control={form.control} />
        <ObservationsField control={form.control} />
        
        <FormActions 
          isSubmitting={isSubmitting} 
          onCancel={onCancel} 
          isEditing={isEditing} 
        />
      </form>
    </Form>
  );
}
