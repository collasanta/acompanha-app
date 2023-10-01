import { ProgramCard } from "@/components/programCard";
import { TrackingTable } from "@/components/trackingTable";
import { getCheckpointsByProgramId, getProgramDays, getUserProgram } from "@/lib/programs";
import { UserProgramResponse } from "@/types/programs";

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

  let days
  const programDays = await getProgramDays(programId, program?.enabled_metrics!)
  if (typeof programDays === 'object' && programDays.days) {
    days = programDays.days;
  }
  else if (typeof programDays === 'object' && programDays.erro) {
    throw new Error(userProgram.erro)
  }

  const checkPoints = await getCheckpointsByProgramId(programId)
  return (
    <div className="">
      <div className="container mx-auto flex justify-center pt-[10px]">
        <ProgramCard program={program!} programPage={true} />
      </div>
      <div className="w-full mx-auto pt-[10px]">
        <TrackingTable Days={days!} enabledMetrics={program?.enabled_metrics!} checkPoints={checkPoints.checkpoints} />
      </div>
    </div>
  )
}