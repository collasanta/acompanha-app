import { z } from "zod";

// Define the form schema
export const workoutFormSchema = z.object({
  workoutName: z.string().min(1, "Workout name is required"),
  workoutTemplate: z.string().optional(),
  workoutContent: z.string().min(1, "Workout description is required"),
  isTemplate: z.boolean().default(false),
  clientId: z.string().optional(),
});

export type WorkoutFormSchemaType = z.infer<typeof workoutFormSchema>;

type WorkoutPlanType = {
  id: string;
  name: string;
  content: string;
  isTemplate: boolean;
  professionalId: string;
  clientId: string | null; // Allow null
  createdAt: Date;
  updatedAt: Date;
};