import { ProgramCard } from "@/components/programCard";
import { ProgramHeader } from "@/components/programHeaders";
import { TrackingTable } from "@/components/trackingTable";
import { checkIfProfessionalOwnsProgram } from "@/lib/professional";
import { getCheckpointsByProgramId, getProgramDays, getUserProgram } from "@/lib/programs";
import { DailyDataType, UserProgramResponse } from "@/types/programs";
import { Metadata, ResolvingMetadata } from "next";
import manifest from "../../../../public/manifest.json";

// export const metadata: Metadata = {
//   // title: 'diario.fit',
//   // description: 'Seu Diário Fitness de hábitos saudáveis',
//   manifest: '/manifest.json',
//   icons: { apple: '/icon.png' },
//   // themeColor: '#f1f5f9',
//   // appleWebApp: {
//   //   capable: true,
//   //   statusBarStyle: 'default',
//   //   title: 'acompanha.app',
//   //   startupImage: [
//   //     { media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)', url: '/iphone5_splash.png' },
//   //     { media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)', url: '/iphone6_splash.png' },
//   //     { media: '(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)', url: '/iphoneplus_splash.png' },
//   //     { media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)', url: '/iphonex_splash.png' },
//   //     { media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)', url: '/iphonexr_splash.png' },
//   //     { media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)', url: '/iphonexsmax_splash.png' },
//   //     { media: '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)', url: '/ipadpro1_splash.png' },
//   //     { media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)', url: '/ipadpro3_splash.png' },
//   //     { media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)', url: '/ipadpro2_splash.png' },
//   //   ],
//   // },
// }

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