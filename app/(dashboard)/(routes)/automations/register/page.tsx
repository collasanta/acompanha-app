import { getDietPlansByProfessional } from "@/lib/diets";
import DietAutomationRegistration from "./automation-registration-form";

interface DietPlan {
  id: string;
  name: string;
}

export default async function DietAutomationRegistrationPage() {
  const dietPlansResult = await getDietPlansByProfessional();

  let dietPlans: DietPlan[] = [];
  if ("dietPlans" in dietPlansResult && dietPlansResult.dietPlans) {
    dietPlans = dietPlansResult.dietPlans.map((plan) => ({
      id: plan.id,
      name: plan.name,
    }));
  } else {
    console.error("Erro ao buscar planos de dieta:", dietPlansResult.error);
  }

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
      <DietAutomationRegistration dietPlans={dietPlans} />
    </div>
  );
}
