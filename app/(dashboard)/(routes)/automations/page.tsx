import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getDietAutomationsByProfessional } from "@/lib/automations";
import DietAutomationCard from "@/components/dietAutomationCard";
import { AutomationType } from "@/types/automations";

export default async function AutomationsPage() {
  const automationsResult = await getDietAutomationsByProfessional();

  let automations: AutomationType[] = [];

  if ("dietAutomations" in automationsResult) {
    automations = automationsResult?.dietAutomations!;
  } else {
    console.error("Erro ao buscar automações:", automationsResult.error);
  }

  return (
    <div className="pb-[100px]">
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Automações
        </h2>
        <p className="text-muted-foreground font-light text-small md:text-lg text-center">
          Suas automações
        </p>
      </div>
      <div className="px-4 flex justify-center md:px-20 lg:px-32 space-y-4 items-center">
        <Link href="/automations/register">
          <Button className="p-4 flex shadow-md">
            <PlusIcon className="w-6 h-6 pr-2" />
            Cadastrar Nova Automação
          </Button>
        </Link>
      </div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4 pt-8 mx-auto flex flex-col justify-center md:min-w-[400px]">
        <div className="space-y-4">
          {automations.map((automation) => (
            <DietAutomationCard key={automation.id} automation={automation} />
          ))}
        </div>
      </div>
    </div>
  );
}
