/* eslint-disable @next/next/no-img-element */
"use client"
import { Button } from "@/components/ui/button";
import { programsFrontEndListType } from "@/types/programs";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProgramCard } from "@/components/programCard";
import { getUserPrograms } from "@/lib/programs";

const DashboardPage = () => {
  const router = useRouter();

  const [programs, setPrograms] = useState<[programsFrontEndListType]>();

  useEffect(() => {
    (async function () {
      const programsData: any = await getUserPrograms();
      if (typeof programsData === 'object' && programsData.userPrograms) {
        console.log("programsData", programsData);
        setPrograms(programsData.userPrograms)
      }
      else if (typeof programsData === 'object' && programsData.error) {
        console.log("programsData fetching error", programsData.error)
      }
    })();
  }, []);

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
        <Button
          className="p-4 flex rounded-full shadow-md"
          onClick={() => { router.push('/cadastro') }}
        >
          <PlusIcon className="w-6 h-6 pr-2" />
          <a> Adicionar Novo Programa </a>
        </Button>
      </div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4 pt-8">
        {programs?.map((program: programsFrontEndListType) => (
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