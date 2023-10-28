import { ProgramHeader } from "@/components/programHeaders";
import { TrackingTable } from "@/components/trackingTable";
import { checkIfProfessionalOwnsProgram } from "@/lib/professional";
import { getCheckpointsByProgramId, getProgramDays, getUserProgram } from "@/lib/programs";

export default async function ProgramPage({ params }: { params: { programId: string } }) {
  console.log("ProgramPage render - useServer ")
  const { programId } = params

  const [userProgram, programDays] = await Promise.all([
  // const [userProgram, programDays, checkPoints, isAdmin] = await Promise.all([
    getUserProgram(programId),
    getProgramDays(programId),
    // getCheckpointsByProgramId(programId),
    // checkIfProfessionalOwnsProgram(programId)
  ]);
  
  if (typeof userProgram === 'object' && userProgram.erro) {
    throw new Error(userProgram.erro)
  }

  if (typeof programDays === 'object' && programDays.erro) {
    throw new Error(programDays.erro)
  }

  return (
    <div>
      {/* <AddToHomeScreen /> */}
      <div className="w-full flex justify-center">
        <ProgramHeader program={userProgram.userProgram!} />
        {/* <ProgramHeader program={userProgram.userProgram!} checkpoints={checkPoints.checkpoints} /> */}
      </div>
      <div className="w-full mx-auto">
        <TrackingTable  Days={programDays?.days!} enabledMetrics={userProgram?.userProgram?.enabled_metrics!} />
        {/* <TrackingTable isAdmin={isAdmin} Days={programDays?.days!} enabledMetrics={userProgram?.userProgram?.enabled_metrics!} checkPoints={checkPoints.checkpoints} /> */}
      </div>
    </div>
  )
}

export function generateMetadata(
  { params }: {params: {programId:string}},
) {
  const { programId } = params  
  return {
    manifest: `/api/manifest?program=${programId}`,
    description: 'Seu Diário de Acompanhamento está pronto, clique para acessar!',
  }
}