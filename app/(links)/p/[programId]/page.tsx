import AddToHomeScreen from "@/components/AddToHomeScreen/AddToHomeScreen";
import { ProgramCard } from "@/components/programCard";
import { ProgramHeader } from "@/components/programHeaders";
import { TrackingTable } from "@/components/trackingTable";
import { checkIfProfessionalOwnsProgram } from "@/lib/professional";
import { getCheckpointsByProgramId, getProgramDays, getUserProgram } from "@/lib/programs";
import { DailyDataType, UserProgramResponse } from "@/types/programs";
import { Metadata, ResolvingMetadata } from "next";

export default async function ProgramPage({ params }: { params: { programId: string } }) {
  
  const { programId } = params
  const userProgram: UserProgramResponse = await getUserProgram(programId);

  let program
  if (typeof userProgram === 'object' && userProgram.userProgram) {
    program = userProgram.userProgram;
  }
  else if (typeof userProgram === 'object' && userProgram.erro) {
    throw new Error(userProgram.erro)
  }

  let days: Array<DailyDataType>
  const programDays = await getProgramDays(programId, program?.enabled_metrics!)
  if (typeof programDays === 'object' && programDays.days) {
    // @ts-ignore
    days = programDays.days;
  }
  else if (typeof programDays === 'object' && programDays.erro) {
    throw new Error(userProgram.erro)
  }

  const checkPoints = await getCheckpointsByProgramId(programId)

  const isAdmin = await checkIfProfessionalOwnsProgram(programId)

  return (
    <div className="">
      <AddToHomeScreen />
      <div className="w-full flex justify-center">
        <ProgramHeader program={program!} checkpoints={checkPoints.checkpoints} />
      </div>
      <div className="w-full mx-auto">
        <TrackingTable isAdmin={isAdmin} Days={days!} enabledMetrics={program?.enabled_metrics!} checkPoints={checkPoints.checkpoints} />
      </div>
    </div>
  )
}

export async function generateMetadata(
  { params }: {params: {programId:string}},
): Promise<Metadata> {
  const { programId } = params  
  return {
    manifest: `/api/manifest?program=${programId}`,
    description: 'Seu Diário de Acompanhamento está pronto, clique para acessar!',
  }
}