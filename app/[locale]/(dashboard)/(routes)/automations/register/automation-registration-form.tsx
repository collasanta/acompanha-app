"use client";

import React, { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon, SaveIcon, SearchIcon, Trash2Icon } from "lucide-react";
import { registerDietAutomation } from "@/lib/automations";

interface DietPlan {
  id: string;
  name: string;
}

interface DietAutomationRegistrationProps {
  dietPlans: DietPlan[];
}

interface CalorieRule {
  calories: number;
  dietId: string;
}

export default function DietAutomationRegistration({
  dietPlans,
}: DietAutomationRegistrationProps) {
  const router = useRouter();
  const [automationName, setAutomationName] = useState("");
  const [calorieRules, setCalorieRules] = useState<CalorieRule[]>([
    { calories: 1000, dietId: "" },
    { calories: 1100, dietId: "" },
    { calories: 1200, dietId: "" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeRuleIndex, setActiveRuleIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleAddRule = () => {
    const lastCalories = calorieRules[calorieRules.length - 1].calories;
    setCalorieRules([
      ...calorieRules,
      { calories: lastCalories + 100, dietId: "" },
    ]);
  };

  const handleRemoveRule = (index: number) => {
    const newRules = calorieRules.filter((_, i) => i !== index);
    setCalorieRules(newRules);
  };

  const handleDietSelect = (index: number, dietId: string) => {
    const newRules = [...calorieRules];
    newRules[index].dietId = dietId;
    setCalorieRules(newRules);
    setIsDropdownOpen(false);
    setSearchTerm("");
    setActiveRuleIndex(null);
  };

  const filteredDietPlans = dietPlans.filter((diet) =>
    diet.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = async () => {
    try {
      if (!automationName.trim()) {
        toast.error("Por favor, insira um nome para a automação");
        return;
      }

      const rules = calorieRules.reduce((acc, rule) => {
        if (rule.dietId) {
          acc[rule.calories] = rule.dietId;
        }
        return acc;
      }, {} as Record<number, string>);

      if (Object.keys(rules).length === 0) {
        toast.error("Por favor, defina pelo menos uma regra válida");
        return;
      }

      const result = await registerDietAutomation({
        name: automationName,
        rule: JSON.stringify(rules),
      });

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.automationId) {
        toast.success("Automação de dieta salva com sucesso!");
        router.push("/automations");
      } else {
        throw new Error("Falha ao criar automação");
      }
    } catch (error) {
      console.error("Erro ao salvar automação de dieta:", error);
      toast.error(
        "Falha ao salvar automação de dieta: " + (error as Error).message
      );
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="space-y-4 mt-4">
        <div>
          <Label htmlFor="automationName">Nome da Automação</Label>
          <Input
            id="automationName"
            value={automationName}
            onChange={(e) => setAutomationName(e.target.value)}
            placeholder="Digite o nome da automação"
          />
        </div>

        <div className="space-y-2">
          {calorieRules.map((rule, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                type="number"
                value={rule.calories}
                onChange={(e) => {
                  const newRules = [...calorieRules];
                  newRules[index].calories = Number(e.target.value);
                  setCalorieRules(newRules);
                }}
                className="w-24"
                min="1000"
                max="5000"
              />
              <span>kcal</span>
              <div className="relative flex-grow" ref={dropdownRef}>
                <Input
                  type="text"
                  placeholder="Buscar plano de dieta..."
                  value={
                    activeRuleIndex === index
                      ? searchTerm
                      : dietPlans.find((d) => d.id === rule.dietId)?.name || ""
                  }
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsDropdownOpen(true);
                    setActiveRuleIndex(index);
                  }}
                  onFocus={() => {
                    setIsDropdownOpen(true);
                    setActiveRuleIndex(index);
                  }}
                  className="w-full pr-10"
                />
                <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                {isDropdownOpen &&
                  activeRuleIndex === index &&
                  filteredDietPlans.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 max-h-60 overflow-auto">
                      {filteredDietPlans.map((diet) => (
                        <li
                          key={diet.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex justify-between"
                          onClick={() => handleDietSelect(index, diet.id)}
                        >
                          <span>{diet.name}</span>
                          <span className="text-gray-400">{diet.id}</span>
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleRemoveRule(index)}
              >
                <Trash2Icon className="h-4 w-4 text-red-400" />
              </Button>
            </div>
          ))}
        </div>

        <Button variant="outline" onClick={handleAddRule}>
          <PlusIcon className="mr-2 h-4 w-4" /> Adicionar Regra
        </Button>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSave}>
          <SaveIcon className="mr-2 h-4 w-4" /> Salvar Automação
        </Button>
      </CardFooter>
    </Card>
  );
}
