import { getClient } from "@/lib/client";
import { getDietPlansByProfessional } from "@/lib/diets";
import ClientProfileInteractive from "./client-profile-interactive";

export default async function ClientProfilePage({
  params,
}: {
  params: { clientId: string };
}) {
  const { clientId } = params;

  const clientPromise = getClient(clientId);
  const dietPlansPromise = getDietPlansByProfessional();

  const [clientResult, dietPlansResult] = await Promise.all([
    clientPromise,
    dietPlansPromise,
  ]);

  if ("error" in clientResult) {
    return <div>Erro ao carregar cliente: {clientResult.error}</div>;
  }

  if ("error" in dietPlansResult) {
    return <div>Erro ao carregar dietas: {dietPlansResult.error}</div>;
  }

  return (
    <ClientProfileInteractive
      initialClient={clientResult}
      initialDietPlans={dietPlansResult.dietPlans}
    />
  );
}
