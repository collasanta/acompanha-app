import { ProgramHeader } from "@/components/programHeaders";
import { TrackingTable } from "@/components/tracking-table";
import { getProgramDays, getUserProgram } from "@/lib/programs";

export default async function ProgramPage({ params }: { params: { programId: string } }) {
  console.log("ProgramPage render - useServer ")
  const { programId } = params

  const [userProgram, programDays] = await Promise.all([
    getUserProgram(programId),
    getProgramDays(programId),
  ]);
  
  if (typeof userProgram === 'object' && userProgram.error) {
    throw new Error(userProgram.error)
  }

  if (typeof programDays === 'object' && programDays.error) {
    throw new Error(programDays.error)
  }

  return (
    <div>
      <div className="w-full flex justify-center">
        <ProgramHeader program={userProgram.userProgram!} />
      </div>
      <div className="w-full mx-auto">
        <TrackingTable  Days={programDays?.days!} enabledMetrics={userProgram?.userProgram?.enabled_metrics!} />
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