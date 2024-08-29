import React from "react";
import Link from "next/link";
import { getDietPlanById } from "@/lib/diets";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  UserIcon,
  FileIcon,
  InfoIcon,
  ExternalLink,
} from "lucide-react";
import EditableDietContent from "@/components/block-editor-editable-diet";
import DeleteDietButton from "./delete-diet-button";

export default async function DietPage({
  params,
}: {
  params: { dietId: string };
}) {
  const { dietId } = params;

  const dietPlan = await getDietPlanById(dietId);

  if ("error" in dietPlan) {
    throw new Error(dietPlan.error);
  }

  const diet = dietPlan.dietPlan;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-2">Detalhes da Dieta</h1>
      <p className="text-muted-foreground text-center mb-8">
        Informações detalhadas do plano alimentar
      </p>

      <Card className="max-w-4xl mx-auto relative">
        <div className="my-4 text-center"></div>
        <DeleteDietButton dietId={diet.id} />
        <CardHeader>
          <CardTitle className="text-2xl mb-1">{diet.name}</CardTitle>
          <CardDescription>
            Criado em {new Date(diet.createdAt).toLocaleDateString("pt-BR")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center gap-2">
              <UserIcon className="text-muted-foreground" />
              <span>
                Cliente:{" "}
                {diet.clientId ? (
                  <Link
                    href={`/clients/${diet.clientId}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                  >
                    {diet.client?.name}
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </Link>
                ) : (
                  "Não atribuído"
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FileIcon className="text-muted-foreground" />
              <span>
                Tipo: {diet.isTemplate ? "Template" : "Dieta Personalizada"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="text-muted-foreground" />
              <span>
                Atualizado em:{" "}
                {new Date(diet.updatedAt).toLocaleDateString("pt-BR")} às{" "}
                {new Date(diet.updatedAt).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {diet.isTemplate ? "Template" : "Personalizado"}
              </Badge>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <InfoIcon className="text-muted-foreground" />
                Conteúdo da Dieta
              </h3>
              <EditableDietContent
                initialContent={diet.content}
                dietId={diet.id}
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
  params: { dietId: string };
}) {
  const { dietId } = params;
  const dietPlan = await getDietPlanById(dietId);

  if ("error" in dietPlan) {
    return {
      title: "Dieta Não Encontrada",
      description: "A dieta solicitada não pôde ser encontrada.",
    };
  }

  const diet = dietPlan.dietPlan;

  return {
    title: `Dieta: ${diet.name}`,
    description: `Detalhes do plano alimentar: ${diet.name}`,
  };
}
