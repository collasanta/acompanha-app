import { Button } from "@/components/ui/button";
import { programsFrontEndListType } from "@/types/programs";
import { PlusIcon } from "lucide-react";
import { ProgramCard } from "@/components/programCard";
import { getUserPrograms } from "@/lib/programs";
import toast from "react-hot-toast";

const DashboardPage = async () => {

  const userPrograms: any = await getUserPrograms();
  let programs
  if (typeof userPrograms === 'object' && userPrograms.userPrograms) {
    programs = userPrograms.userPrograms;
    console.log("rend")
  }
  else if (typeof userPrograms === 'object' && userPrograms.error) {
    toast.error("Erro ao carregar programas: ", userPrograms.error)
  }

  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Programas
        </h2>
        <p className="text-muted-foreground font-light text-small md:text-lg text-center">
          Crie e acompanhe seus programas por aqui
        </p>
      </div>
      <div className="px-4 flex justify-center md:px-20 lg:px-32 space-y-4 items-center">
        <a href="/cadastro">
          <Button
            className="p-4 flex rounded-full shadow-md"
          >
            <PlusIcon className="w-6 h-6 pr-2" />
            Adicionar Novo Programa
          </Button>
        </a>
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