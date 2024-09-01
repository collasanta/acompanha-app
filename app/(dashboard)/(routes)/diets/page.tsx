import { PlusIcon } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { getDietPlansByProfessional } from "@/lib/diets";
import DietCard from "@/components/dietCard";
import { Button } from "@/components/ui/button";

const DietsPage = async () => {
  const { error, dietPlans } = await getDietPlansByProfessional();

  if (error) {
    toast.error("Erro ao carregar dietas: " + error);
    return null;
  }

  return (
    <div className="pb-[100px]">
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">Dietas</h2>
        <p className="text-muted-foreground font-light text-small md:text-lg text-center">
          Biblioteca de Dietas
        </p>
      </div>
      <div className="px-4 flex justify-center md:px-20 lg:px-32 space-y-4 items-center">
        <Link href="/diets/register">
          <Button className="p-4 flex shadow-md">
            <PlusIcon className="w-6 h-6 pr-2" />
            Cadastrar Nova Dieta
          </Button>
        </Link>
      </div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4 pt-8 mx-auto flex flex-col justify-center md:min-w-[400px]">
        {dietPlans &&
          dietPlans.map((diet) => <DietCard key={diet.id} diet={diet} />)}
      </div>
    </div>
  );
};

export default DietsPage;
