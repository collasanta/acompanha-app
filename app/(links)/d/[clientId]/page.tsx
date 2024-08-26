// app/d/[clientId]/page.tsx
import { getClientWithCurrentDiet } from "@/lib/client";
import { DietHeader } from "@/components/dietHeaders";
import DietContent from "@/components/diet-content";
import { notFound } from "next/navigation";

export default async function ClientDietPage({
  params,
}: {
  params: { clientId: string };
}) {
  const { clientId } = params;

  const result = await getClientWithCurrentDiet(clientId);

  if ("error" in result) {
    notFound();
  }

  const { client, currentDiet } = result;

  if (!currentDiet) {
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
        <DietHeader client={client} diet={currentDiet} />
      </div>
      <div className="w-full mx-auto mt-6">
        <DietContent content={currentDiet.content} />
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
