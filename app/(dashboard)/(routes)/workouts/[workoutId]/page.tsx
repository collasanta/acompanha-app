import React from "react";
import { getWorkoutPlanById } from "@/lib/workouts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, UserIcon, FileIcon, InfoIcon } from "lucide-react";
import EditableWorkoutContent from "@/components/block-editor-editable";

export default async function WorkoutPage({
  params,
}: {
  params: { workoutId: string };
}) {
  const { workoutId } = params;

  const workoutPlan = await getWorkoutPlanById(workoutId);

  if ("error" in workoutPlan) {
    throw new Error(workoutPlan.error);
  }

  const workout = workoutPlan.workoutPlan;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-2">
        Detalhes do Treino
      </h1>
      <p className="text-muted-foreground text-center mb-8">
        Informações detalhadas do plano de treino
      </p>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl mb-1">{workout.name}</CardTitle>
          <CardDescription>
            Criado em {new Date(workout.createdAt).toLocaleDateString("pt-BR")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center gap-2">
              <UserIcon className="text-muted-foreground" />
              <span>
                Cliente:{" "}
                {workout.client ? workout.client.name : "Não atribuído"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FileIcon className="text-muted-foreground" />
              <span>
                Tipo: {workout.isTemplate ? "Template" : "Treino Personalizado"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="text-muted-foreground" />
              <span>
                Atualizado em:{" "}
                {new Date(workout.updatedAt).toLocaleDateString("pt-BR")} às{" "}
                {new Date(workout.updatedAt).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {workout.isTemplate ? "Template" : "Personalizado"}
              </Badge>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <InfoIcon className="text-muted-foreground" />
                Conteúdo do Treino
              </h3>
              <EditableWorkoutContent
                initialContent={workout.content}
                workoutId={workout.id}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { workoutId: string };
}) {
  const { workoutId } = params;
  const workoutPlan = await getWorkoutPlanById(workoutId);

  if ("error" in workoutPlan) {
    return {
      title: "Workout Not Found",
      description: "The requested workout could not be found.",
    };
  }

  const workout = workoutPlan.workoutPlan;

  return {
    title: `Workout: ${workout.name}`,
    description: `Details for workout plan: ${workout.name}`,
  };
}
