import { Button } from "@/components/ui/button";
import { programsFrontEndListType } from "@/types/programs";
import { PlusIcon } from "lucide-react";
import { ProgramCard } from "@/components/programCard";
import { getUserPrograms } from "@/lib/programs";
import toast from "react-hot-toast";
import Link from "next/link";

const DashboardPage = async () => {

  const userPrograms: any = await getUserPrograms();
  let programs
  if (typeof userPrograms === 'object' && userPrograms.userPrograms) {
    programs = userPrograms.userPrograms;
  }
  else if (typeof userPrograms === 'object' && userPrograms.error) {
    toast.error("Erro ao carregar programas: ", userPrograms.error)
  }

  return (
    <div className="pb-[100px]">
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Diários de Acompanhamento
        </h2>
        <p className="text-muted-foreground font-light text-small md:text-lg text-center">
          Acompanhe os diários de seus pacientes
        </p>
      </div>
      <div className="px-4 flex justify-center md:px-20 lg:px-32 space-y-4 items-center">
        <Link href="/cadastro">
          <Button
            className="p-4 flex shadow-md"
          >
            <PlusIcon className="w-6 h-6 pr-2" />
            Criar Novo Diário
          </Button>
        </Link>
      </div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4 pt-8 mx-auto flex flex-col justify-center md:min-w-[400px]">
        {programs && programs?.map((program: programsFrontEndListType) => (
          <ProgramCard
            key={program.id}
            program={program}
          />
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;