"use server"

import { auth } from "@clerk/nextjs"
import prismadb from "./prismadb"
import { generateId } from "./utils"
import { programsFormSchema, programsFormSchemaType } from "@/types/programs"
import { checkClientByWhatsapp, createNewClient } from "./client"
import { revalidatePath } from "next/cache"

export const getUserPrograms = async () => {
  const { userId } = auth()
  if (!userId) {return { erro: "user not logged in" }}

  try {
    const programs = await prismadb.program.findMany({
      select: {
        id: true,
        name: true,
        start_date: true,
        duration: true,
        end_date: true,
        enabled_metrics: true,
        status: true,
        client: {
          select: {
            name: true,
            whatsapp: true,
          },
        },
      },
    });
    return { userPrograms: programs }
  } catch (error: any) {
    return { erro: error.message }
  }
}

export const getUserProgram = async (programId:string) => {
  const { userId } = auth()
  if (!userId) {
    return { erro: "user not logged in" }
  }

  try {
    const program = await prismadb.program.findUnique({
      where: { id: programId },
      select: {
        id: true,
        name: true,
        start_date: true,
        duration: true,
        end_date: true,
        enabled_metrics: true,
        status: true,
        client: {
          select: {
            name: true,
            whatsapp: true,
          },
        },
      },
    });

    return { userProgram: program }
  } catch (error: any) {
    return { erro: error.message }
  }
}

export const registerNewProgram = async (finalForm: programsFormSchemaType) => {
  try {
    let { userId } = auth()
    if (!userId) { return { erro: "user not logged in" } }


    const typeCheck = programsFormSchema.safeParse(finalForm)
    if (!typeCheck.success) { return { erro: typeCheck.error.format() } }

    // PRIMEIRO CHECA SE O CLIENTE JÁ EXISTE
    let clientId = await checkClientByWhatsapp(finalForm.clientWhatsapp);

    if (clientId === false) {
      clientId = await createNewClient(finalForm.clientWhatsapp, finalForm.clientName, userId);
    }

    if (typeof clientId === 'object' && 'erro' in clientId) {
      return { erro: clientId.erro };
    }

    const enabled_metrics = {
      peso: finalForm.metricspeso,
      dieta: finalForm.metricsdieta,
      treino: finalForm.metricstreino
    }

    const newProgram = await prismadb.program.create({
      data: {
        id: generateId(),
        name: finalForm.programName,
        professionalId: userId,
        start_date: finalForm.startDate,
        duration: finalForm.duration,
        end_date: finalForm.endDate!,
        enabled_metrics: enabled_metrics,
        status: "created",
        clientId: clientId,
        daysActive: 0,
        daysPaid: 0,
      }
    })

    const newDays = createProgramDays(newProgram.id, finalForm.startDate, finalForm.endDate!)
    if (typeof newDays === 'object' && 'erro' in newDays) {
      console.log("Erro ao criar dias: ", newDays.erro)
      return { erro: newDays.erro };
    }

    return { programId: newProgram.id }

  } catch (error: any) {
    return { erro: error.message }
  }
}

export const getProgramDays = async (programId: string, enabledMetrics:any) => {
    
  try {
    const days = await prismadb.dailyData.findMany({
      where: {
        programId: programId
      },
      select: {
        date: true,
        diet: await getActiveMetricsDB(enabledMetrics, "dieta"),
        exercise: await getActiveMetricsDB(enabledMetrics, "treino"),
        weight: await getActiveMetricsDB(enabledMetrics, "peso"),
        notes: true,
        checkpointId: true,
        programId: true
      },
      orderBy: {
        date: "asc"
      }
    })
    return { days: days }
  } catch (error: any) {
    return { erro: error.message }
  }
}

const createProgramDays = async (programId: string, startDate: Date, endDate: Date) => {
  try {
    const days = []
    let currentDate = startDate
    let day = 0
    while (currentDate <= endDate) {

      if (day % 30 === 0 && day !== 0 ) { // avaliacao mensal
        const checkpoint = await createCheckpoint(programId, currentDate)

        if (typeof checkpoint === 'object' && 'erro' in checkpoint) {
          return { erro: checkpoint.erro }
        }

        days.push({
          programId: programId,
          date: currentDate,
          checkpointId: checkpoint.checkpoint
        })

      } else {
        days.push({
          programId: programId,
          date: currentDate,
        })

      }

      day++
      currentDate = new Date(currentDate.getTime() + 86400000)
    }
    const newDays = await prismadb.dailyData.createMany({
      data: days
    })
    console.log("Dias criados: ", newDays)
    return { days: newDays }
  } catch (error: any) {
    return { erro: error.message }
  }
}

const createCheckpoint = async (programId: string, date: Date) => {
  try {
    const checkpoint = await prismadb.checkpoint.create({
      data: {
        date: date,
        programId: programId,
      }
    })
    return { checkpoint: checkpoint.id }
  } catch (error: any) {
    return { erro: error.message }
  }
}


export const getProperty = async (name:string) => {
  if (name === "peso") {
  return "weight"
  } else if (name === "dieta") {
  return "diet"
  } else if (name === "treino") {
  return "exercise"
  }
}

const getActiveMetricsDB = async (enabledMetrics: any, metric:string) => {    
  if (enabledMetrics[`${metric}`] === true) {
    return true
  }
  return false
}

export const setDiet = async (date:Date, programId:string, boolean:boolean) => {
    const result = await prismadb.dailyData.update({
      where: {
        programId_date: {
          programId:programId,
          date:date,
        },
      },
      data: {
        diet: boolean
      }
    })
    revalidatePath(`/p/${programId}`)
    console.log("Diet set: ", result.date, "value:", result.diet)
}