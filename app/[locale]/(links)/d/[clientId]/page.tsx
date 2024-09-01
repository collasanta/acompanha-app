// app/d/[clientId]/page.tsx
import { DietHeader } from "@/components/dietHeaders";
import { notFound } from "next/navigation";
import { getClientWithCurrentDiet } from "@/lib/diets";
import DietContent from "@/components/dietContent";
import ViewDietContent from "@/components/block-view-diet";

export default async function ClientDietPage({
  params,
}: {
  params: { clientId: string };
}) {
  const { clientId } = params;

  console.log("clientId", clientId);

  const result = await getClientWithCurrentDiet(clientId);

  if ("error" in result) {
    notFound();
  }

  const client = result;

  if (!client.currentDietPlan) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Nenhuma dieta atribuída</h1>
        <p>Não há uma dieta atual atribuída a este cliente.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full flex justify-center">
        <DietHeader client={client} diet={client.currentDietPlan} />
      </div>
      <div className="w-full mx-auto mt-6">
        <ViewDietContent initialContent={client.currentDietPlan.content} />
      </div>
    </div>
  );
}

export function generateMetadata({ params }: { params: { clientId: string } }) {
  return {
    title: `Minha Dieta`,
    description: "Seu plano alimentar personalizado está pronto para consulta!",
  };
}
