"use server"

import { auth } from "@clerk/nextjs"
import prismadb from "./prismadb"
import { generateId } from "./utils"
import { programsFormSchema, programsFormSchemaType } from "@/types/programs"
import { checkClientByWhatsapp, createNewClient } from "./client"
import { revalidatePath } from "next/cache"

export const getUserPrograms = async () => {
  const { userId } = auth()
  if (!userId) { return { erro: "usuário não logado " } }

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

export const getUserProgram = async (programId: string) => {
  // const { userId } = auth()
  // if (!userId) {
  //   return { erro: "usuário não logado " }
  // }

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
    if (!userId) { return { erro: "usuário não logado " } }


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

    const newDays = createProgramDays(newProgram.id, finalForm.startDate, finalForm.duration)
    if (typeof newDays === 'object' && 'erro' in newDays) {
      console.log("Erro ao criar dias: ", newDays.erro)
      return { erro: newDays.erro };
    }

    return { programId: newProgram.id }

  } catch (error: any) {
    return { erro: error.message }
  }
}

export const getProgramDays = async (programId: string, enabledMetrics: any) => {

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

const createProgramDays = async (programId: string, startDate: Date, duration: number) => {
  try {
    const days = []
    let currentDate = startDate
    let day = 1

    while (day <= duration) {
      

      if (day === 1) { // avaliacao inicial
        const checkpoint = await createCheckpoint(programId, currentDate, "initial")

        if (typeof checkpoint === 'object' && 'erro' in checkpoint) {
          console.log("0 Erro ao criar checkpoint: ", checkpoint.erro)
          return { erro: checkpoint.erro }
        }
        console.log("currentDate: ", currentDate, "day:", day)
        days.push({
          programId: programId,
          date: currentDate,
          checkpointId: checkpoint.checkpoint
        })
        console.log("days: ", days)

      } else if (day % 30 === 0 && day !== 1 && day !== duration) { // avaliacao mensal

        const checkpoint = await createCheckpoint(programId, currentDate, "review")

        if (typeof checkpoint === 'object' && 'erro' in checkpoint) {
          console.log("1 Erro ao criar checkpoint: ", checkpoint.erro)
          return { erro: checkpoint.erro }
        }
        console.log("currentDate: ", currentDate, "day:", day)
        days.push({
          programId: programId,
          date: currentDate,
          checkpointId: checkpoint.checkpoint
        })
        console.log("days: ", days)
      } else if (day === duration) { // avaliacao final
        const checkpoint = await createCheckpoint(programId, currentDate, "final")

        if (typeof checkpoint === 'object' && 'erro' in checkpoint) {
          console.log("2 Erro ao criar checkpoint: ", checkpoint.erro)
          return { erro: checkpoint.erro }
        }
        console.log("currentDate: ", currentDate, "day:", day)
        days.push({
          programId: programId,
          date: currentDate,
          checkpointId: checkpoint.checkpoint
        })
        console.log("days: ", days)
      } else {
        console.log("currentDate: ", currentDate, "day:", day)
        days.push({
          programId: programId,
          date: currentDate,
        })
        console.log("days: ", days)
      }
      
      day++
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1))
    }

    const newDays = await prismadb.dailyData.createMany({
      data: days
    })
    return { days: newDays }
  } catch (error: any) {
    console.log("Erro ao criar dias: ", error.message)
    return { erro: error.message }
  }
}

const createCheckpoint = async (programId: string, date: Date, description: string) => {
  try {
    const checkpoint = await prismadb.checkpoint.create({
      data: {
        date: date,
        programId: programId,
        description: description
      }
    })
    return { checkpoint: checkpoint.id }
  } catch (error: any) {
    return { erro: error.message }
  }
}

export const getProperty = async (name: string) => {
  if (name === "peso") {
    return "weight"
  } else if (name === "dieta") {
    return "diet"
  } else if (name === "treino") {
    return "exercise"
  }
}

const getActiveMetricsDB = async (enabledMetrics: any, metric: string) => {
  if (enabledMetrics[`${metric}`] === true) {
    return true
  }
  return false
}

export const setDiet = async (date: Date, programId: string, boolean: boolean) => {
  const result = await prismadb.dailyData.update({
    where: {
      programId_date: {
        programId: programId,
        date: date,
      },
    },
    data: {
      diet: boolean
    }
  })
  revalidatePath(`/p/${programId}`)
  console.log("Diet set: ", result.date, "value:", result.diet)
}

export const setExercise = async (date: Date, programId: string, boolean: boolean) => {
  const result = await prismadb.dailyData.update({
    where: {
      programId_date: {
        programId: programId,
        date: date,
      },
    },
    data: {
      exercise: boolean
    }
  })
  revalidatePath(`/p/${programId}`)
  console.log("Exercise set: ", result.date, "value:", result.diet)
}

export const setWeight = async (date: Date, programId: string, weight: string | null) => {
  if (weight === "") {
    weight = null
  }

  if (weight !== null) {
    weight = weight?.replace(',', '.')
    if (/^-?\d+(\.\d+)?$/.test(weight!) === false) {
      console.log("invalid weight")
      return
    }
  }

  const result = await prismadb.dailyData.update({
    where: {
      programId_date: {
        programId: programId,
        date: date,
      },
    },
    data: {
      weight: weight
    }
  })
  revalidatePath(`/p/${programId}`)
  console.log("Weight set: ", result.date, "value:", result.weight)
}

export const setNotes = async (date: Date, programId: string, notes: string, oldnote: string) => {
  if (notes === undefined) {
    return
  } else if (notes === oldnote) {
    return
  }
  const result = await prismadb.dailyData.update({
    where: {
      programId_date: {
        programId: programId,
        date: date,
      },
    },
    data: {
      notes: notes
    }
  })
  revalidatePath(`/p/${programId}`)
  console.log("notes set: ", result.date, "value:", result.notes)
}

export const getCheckpointsByProgramId = async (programId: string) => {
  const checkpoints = await prismadb.checkpoint.findMany({
    where: {
      programId: programId
    },
    orderBy: {
      date: "asc"
    }
  })
  return { checkpoints: checkpoints }
}

export const getCheckpointById = async (checkpointId: string) => {
  const checkpoint = await prismadb.checkpoint.findUnique({
    where: {
      id: checkpointId
    }
  })
  return { checkpoint: checkpoint }
}

export const setFormsLink = async (checkpointId: string, link: string | null, oldLink: string) => {
  if (link === null) {
    return
  } else if (link === oldLink) {
    console.log("same")
    return
  } else if (link === "" && oldLink !== null) {
    link = null
  } else if (link === "" && oldLink === null) {
    console.log("same")
    return
  }

  const result = await prismadb.checkpoint.update({
    where: {
      id: checkpointId
    },
    data: {
      formUrl: link
    }
  })

  console.log("setFormsLinkResult", result)
  revalidatePath(`/p/${result.programId}`)
  console.log("formLink set: ", result.date, "value:", result.formUrl)
}

export const setDietLink = async (checkpointId: string, link: string | null, oldLink: string) => {
  if (link === null) {
    return
  } else if (link === oldLink) {
    console.log("same")
    return
  } else if (link === "" && oldLink !== null) {
    link = null
  } else if (link === "" && oldLink === null) {
    console.log("same")
    return
  }

  const result = await prismadb.checkpoint.update({
    where: {
      id: checkpointId
    },
    data: {
      dietPlanUrl: link
    }
  })

  console.log("setDietLinkResult", result)
  revalidatePath(`/p/${result.programId}`)
  console.log("dietPlanUrl set: ", "value:", result.dietPlanUrl)
}

export const setTrainingLink = async (checkpointId: string, link: string | null, oldLink: string) => {
  if (link === null) {
    return
  } else if (link === oldLink) {
    console.log("same")
    return
  } else if (link === "" && oldLink !== null) {
    link = null
  } else if (link === "" && oldLink === null) {
    console.log("same")
    return
  }


  const result = await prismadb.checkpoint.update({
    where: {
      id: checkpointId
    },
    data: {
      trainingPlanUrl: link
    }
  })

  revalidatePath(`/p/${result.programId}`)
  console.log("trainingLink set: ", result.date, "value:", result.trainingPlanUrl)
}

export const setFormFilled = async (checkpointId: string, boolean: boolean, oldBoolean: boolean) => {
  if (boolean === oldBoolean) {
    console.log("same")
    return
  }

  const result = await prismadb.checkpoint.update({
    where: {
      id: checkpointId
    },
    data: {
      formFilled: boolean
    }
  })

  console.log("setTrainingLinkResult", result)
  revalidatePath(`/p/${result.programId}`)
  console.log("formFilledSet: ", "value:", result.formFilled)
}


