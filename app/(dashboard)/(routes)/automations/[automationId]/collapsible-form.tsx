"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import DietAutomationEditForm from "./diet-automation-edit-form";
import { ChevronDown, ChevronUp, Pencil, PencilIcon } from "lucide-react";

interface ExpandableAutomationFormProps {
  initialAutomation: {
    id: string;
    name: string;
    rule: string;
  };
  dietPlans: Array<{ id: string; name: string }>;
}

export default function ExpandableAutomationForm({
  initialAutomation,
  dietPlans,
}: ExpandableAutomationFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 mb-8">
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full mb-4"
        variant="outline"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="mr-2 h-4 w-4" /> Fechar Formulário de Edição
          </>
        ) : (
          <>
            <div className="flex flex-row space-x-4">
              <ChevronDown className="mr-2 h-4 w-4" /> Clique aqui para editar a
              automação
              <PencilIcon className="w-5 h-5 text-muted-foreground" />
            </div>
          </>
        )}
      </Button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <DietAutomationEditForm
          initialAutomation={initialAutomation}
          dietPlans={dietPlans}
        />
      </div>
    </div>
  );
}
