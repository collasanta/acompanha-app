import { ProgramCard } from "@/components/programCard";
import { TrackingTable } from "@/components/trackingTable";
import { getProgramDays, getProgramTableNumberOfCols, getUserProgram } from "@/lib/programs";
import { ProgramType, UserProgramResponse } from "@/types/programs";
import toast from "react-hot-toast";


export default async function ProgramPage({ params }: { params: { programId: string } }) {
  const { programId } = params
  const userProgram: UserProgramResponse = await getUserProgram(programId);
  
  let program
  if (typeof userProgram === 'object' && userProgram.userProgram) {
    program = userProgram.userProgram;
    console.log("rend")
  }
  else if (typeof userProgram === 'object' && userProgram.erro) {
    toast.error("Erro ao carregar informações do programa: " + userProgram.erro)
  }

  let days
  const programDays = await getProgramDays(programId, program?.enabled_metrics!)
  if (typeof programDays === 'object' && programDays.days) {
    days = programDays.days;
  }
  else if (typeof programDays === 'object' && programDays.erro) {
    toast.error("Erro ao carregar informações dos dias do programa: " + programDays.erro)
  }

  let cols = await getProgramTableNumberOfCols(program?.enabled_metrics!)

  return (
    <div className="">
      <div className="container mx-auto flex justify-center pt-[10px]">
        <ProgramCard program={program!} programPage={true} />
      </div>
      <div className="w-full mx-auto pt-[10px]">
        <TrackingTable Days={days!} enabledMetrics={program?.enabled_metrics!} cols={cols} />
      </div>
    </div>
  )
}