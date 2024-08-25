"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  MailIcon,
  PhoneIcon,
  InfoIcon,
  UtensilsIcon,
  PencilIcon,
  PlusIcon,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { updateClientDiet } from "@/lib/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClientProfileInteractiveProps } from "@/types/diets";

export default function ClientProfileInteractive({
  initialClient,
  initialDietPlans,
}: ClientProfileInteractiveProps) {
  const [client, setClient] = useState(initialClient);
  const [dietPlans] = useState(initialDietPlans);
  const router = useRouter();

  const handleDietChange = async (dietId: string) => {
    if (dietId === "select") return;
    try {
      const result = await updateClientDiet(client.id, dietId);
      if ("error" in result) {
        throw new Error(result.error);
      }
      setClient({ ...client, currentDietPlanId: dietId });
      toast.success("Dieta atualizada com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar dieta: " + (error as Error).message);
    }
  };

  const handleCreateNewDiet = () => {
    router.push(
      `/diets/register?clientId=${client.id}&replaceCurrentDiet=true`
    );
  };

  const currentDiet = dietPlans.find(
    (diet) => diet.id === client.currentDietPlanId
  );

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-2">Perfil do Cliente</h1>
      <p className="text-muted-foreground text-center mb-8">
        Informações detalhadas do cliente
      </p>

      <Card className="max-w-2xl mx-auto mb-6">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarFallback className="text-2xl">
              {client.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl mb-1">{client.name}</CardTitle>
            <CardDescription>
              Cliente desde{" "}
              {new Date(client.createdAt).toLocaleDateString("pt-BR")}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center gap-2">
              <PhoneIcon className="text-muted-foreground" />
              <span>{client.whatsapp || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <MailIcon className="text-muted-foreground" />
              <span>{client.email || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="text-muted-foreground" />
              <span>
                Atualizado em:{" "}
                {new Date(client.updatedAt).toLocaleDateString("pt-BR")} às{" "}
                {new Date(client.updatedAt).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {client.genre || "Gênero não especificado"}
              </Badge>
              <Badge variant="outline">
                {client.age ? `${client.age} anos` : "Idade não especificada"}
              </Badge>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <InfoIcon className="text-muted-foreground" />
                Informações Adicionais
              </h3>
              <p className="text-muted-foreground">
                {client.info || "Nenhuma informação adicional disponível."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl mb-1 flex items-center gap-2">
            <UtensilsIcon className="w-6 h-6" />
            Plano Alimentar
          </CardTitle>
          <CardDescription>
            Gerencie o plano alimentar do cliente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div>
              <h3 className="font-semibold mb-2">Dieta Atual</h3>
              {currentDiet ? (
                <Link href={`/diets/${currentDiet.id}`} className="block group">
                  <Card className="bg-green-50 hover:bg-green-100 transition-colors">
                    <CardContent className="flex items-center justify-between p-4">
                      <span className="font-medium">{currentDiet.name}</span>
                      <div className="flex items-center text-green-600">
                        <span className="mr-2 text-sm">Editar</span>
                        <PencilIcon className="w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ) : (
                <Card>
                  <CardContent className="p-4 text-muted-foreground">
                    Nenhuma dieta associada
                  </CardContent>
                </Card>
              )}
            </div>
            <div>
              <Button
                onClick={handleCreateNewDiet}
                className="w-full mb-4"
                variant="outline"
              >
                <PlusIcon className="mr-2 h-4 w-4" /> Criar Nova Dieta
              </Button>
              <h3 className="font-semibold mb-2">Trocar Dieta Atual</h3>
              <Select onValueChange={handleDietChange} value="select">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Clique aqui para selecionar outra dieta" />
                </SelectTrigger>
                <SelectContent>
                  {dietPlans.map((diet) => (
                    <SelectItem key={diet.id} value={diet.id}>
                      {diet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
