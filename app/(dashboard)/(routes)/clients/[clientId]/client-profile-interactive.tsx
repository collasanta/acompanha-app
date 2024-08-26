"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
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
  UtensilsIcon,
  PencilIcon,
  PlusIcon,
  LockIcon,
  RefreshCwIcon,
  SearchIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateClientDiet } from "@/lib/client";
import Link from "next/link";
import { ClientProfileInteractiveProps } from "@/types/diets";
import AppDietLink from "@/components/appDietLink";

export default function ClientProfileInteractive({
  initialClient,
  initialDietPlans,
}: ClientProfileInteractiveProps) {
  const [client, setClient] = useState(initialClient);
  const [dietPlans] = useState(initialDietPlans);
  const [currentDiet, setCurrentDiet] = useState(initialClient.currentDietPlan);
  const [isChangingDiet, setIsChangingDiet] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredDietPlans = useMemo(() => {
    if (!searchTerm) return dietPlans;
    return dietPlans.filter((diet) =>
      diet.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [dietPlans, searchTerm]);

  const handleDietChange = async (dietId: string) => {
    try {
      const result = await updateClientDiet(client.id, dietId);
      if (result.client?.currentDietPlan) {
        setCurrentDiet(result.client?.currentDietPlan);
      }
      if ("error" in result) {
        throw new Error(result.error);
      }
      setClient({ ...client, currentDietPlanId: dietId });
      toast.success("Dieta atualizada com sucesso!");
      setIsChangingDiet(false);
      setSearchTerm("");
      setIsDropdownOpen(false);
    } catch (error) {
      toast.error("Erro ao atualizar dieta: " + (error as Error).message);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
              <AppDietLink clientId={client.id} />
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
              <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                <LockIcon className="text-muted-foreground" />
                <span className="flex-grow">
                  {currentDiet ? currentDiet.name : "Nenhuma dieta associada"}
                </span>
                {currentDiet && (
                  <Link href={`/diets/${currentDiet.id}?editing=true`}>
                    <Button variant="outline" size="sm">
                      <PencilIcon className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/diets/register?clientId=${client.id}&replaceCurrentDiet=true`}
              >
                <Button className="flex-1" variant="outline">
                  <PlusIcon className="mr-2 h-4 w-4" /> Criar Nova Dieta
                </Button>
              </Link>
              <Button
                onClick={() => setIsChangingDiet(!isChangingDiet)}
                className="flex-1"
                variant="outline"
              >
                <RefreshCwIcon className="w-4 h-4 mr-2" />
                Trocar Dieta Atual
              </Button>
            </div>
            {isChangingDiet && (
              <div className="w-full" ref={dropdownRef}>
                <h3 className="font-semibold mb-2">Selecione a Nova Dieta</h3>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Buscar dietas..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    className="w-full pr-10"
                  />
                  <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  {isDropdownOpen && filteredDietPlans.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 max-h-60 overflow-auto">
                      {filteredDietPlans.map((diet) => (
                        <li
                          key={diet.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex justify-between"
                          onClick={() => handleDietChange(diet.id)}
                        >
                          <span>{diet.name}</span>
                          <span className="text-gray-400">{diet.id}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
