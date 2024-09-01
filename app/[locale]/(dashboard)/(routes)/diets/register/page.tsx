import { getClientsByProfessional } from "@/lib/client";
import { getDietPlansByProfessional } from "@/lib/diets";
import DietRegistrationForm from "./diet-registration-form";

export default async function DietRegistrationPage() {
  const dietTemplatesResult = await getDietPlansByProfessional();
  const clientsResult = await getClientsByProfessional();

  let dietTemplates = [{ id: "", name: "Nenhum - Clique para selecionar" }];
  if ("dietPlans" in dietTemplatesResult && dietTemplatesResult.dietPlans) {
    dietTemplates = [
      ...dietTemplates,
      ...dietTemplatesResult.dietPlans.map((plan) => ({
        id: plan.id,
        name: plan.name,
      })),
    ];
  } else {
    console.error(
      "Erro ao buscar modelos de dieta:",
      dietTemplatesResult.error
    );
  }

  let clients: { id: string; name: string }[] = [];
  if (Array.isArray(clientsResult)) {
    clients = clientsResult;
  } else if ("error" in clientsResult) {
    console.error("Erro ao buscar clientes:", clientsResult.error);
  }

  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Cadastro de Dietas
        </h2>
        <p className="text-muted-foreground font-light text-small md:text-lg text-center">
          Cadastre novas Dietas
        </p>
      </div>
      <DietRegistrationForm
        initialDietTemplates={dietTemplates}
        initialClients={clients}
      />
    </div>
  );
}
