import { DietPlan } from "@prisma/client";
import { ClientType } from "./clients";
import { ProfessionalType } from "./professionals";

export type DietPlanType = {
  id: string;
  name: string;
  content: string;
  isTemplate: boolean;
  professionalId: string;
  professional?: ProfessionalType | null;
  clientId?: string | null;
  client?: ClientType | null;
  createdAt: Date;
  updatedAt: Date;
};

export type DietFormSchemaType = {
  dietName: string;
  dietContent: string;
  isTemplate: boolean;
  clientId?: string;
  replaceCurrentDiet?: boolean;
};

export type GetDietPlansResult = 
  | { dietPlans: DietPlan[]; error?: undefined }
  | { error: string; dietPlans?: undefined }

export type ClientProfileInteractiveProps = {
    initialClient: ClientType; // Substitua 'any' pelo tipo correto do cliente
    initialDietPlans: DietPlanType[]; // Substitua 'any' pelo tipo correto dos planos de dieta
  };