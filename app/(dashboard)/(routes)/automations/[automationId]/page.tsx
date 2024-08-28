import React from "react";
import { getAutomationById, getAutomationRuns } from "@/lib/automations";
import { getDietPlansByProfessional } from "@/lib/diets";
import DietAutomationRuns from "@/components/dietAutomationRuns";
import DietAutomationEditForm from "./diet-automation-edit-form";

export default async function AutomationDetailsPage({
  params,
}: {
  params: { automationId: string };
}) {
  const automationResult = await getAutomationById(params.automationId);
  const dietPlansResult = await getDietPlansByProfessional();
  const runsResult = await getAutomationRuns(params.automationId);

  if ("error" in automationResult) {
    return <div>Error: {automationResult.error}</div>;
  }

  if ("error" in dietPlansResult) {
    return <div>Error: {dietPlansResult.error}</div>;
  }

  if ("error" in runsResult) {
    return <div>Error: {runsResult.error}</div>;
  }

  const { automation } = automationResult;
  const { dietPlans } = dietPlansResult;
  const { runs } = runsResult;

  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Cadastro de Automação de Dietas
        </h2>
        <p className="text-muted-foreground font-light text-small md:text-lg text-center">
          Configure automações para atribuição de dietas
        </p>
      </div>
      <div className="max-w-[90%] mx-auto">
        <DietAutomationEditForm
          initialAutomation={automation}
          dietPlans={dietPlans}
        />
        <DietAutomationRuns runs={runs} />
      </div>
    </div>
  );
}
