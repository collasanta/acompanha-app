"use server"

import { auth } from "@clerk/nextjs"
import prismadb from "./prismadb"
import { generateId } from "./utils"
import { revalidatePath } from "next/cache"
import { workoutFormSchema, WorkoutFormSchemaType } from "@/types/workouts"

export const registerNewWorkout = async (finalForm: WorkoutFormSchemaType) => {
  try {
    let { userId } = auth()
    if (!userId) { return { error: "Usuário não logado" } }

    const typeCheck = workoutFormSchema.safeParse(finalForm)
    if (!typeCheck.success) { return { error: typeCheck.error.format() } }

    const newWorkout = await prismadb.workoutPlan.create({
      data: {
        id: generateId(),
        name: finalForm.workoutName,
        content: finalForm.workoutContent,
        isTemplate: finalForm.isTemplate,
        professionalId: userId,
        clientId: finalForm.clientId || null,
      }
    })

    revalidatePath(`/workouts`)
    return { workoutId: newWorkout.id }

  } catch (error: any) {
    return { error: error.message }
  }
}

export const getWorkoutPlansByProfessional = async () => {
  try {
    let { userId } = auth()
    if (!userId) { return { error: "Usuário não logado" } }

    const workoutPlans = await prismadb.workoutPlan.findMany({
      where: {
        professionalId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { workoutPlans }

  } catch (error: any) {
    return { error: error.message }
  }
}

export const getWorkoutPlanById = async (id: string) => {
  try {
    let { userId } = auth()
    if (!userId) { return { error: "Usuário não logado" } }

    const workoutPlan = await prismadb.workoutPlan.findUnique({
      where: {
        id: id,
        professionalId: userId,
      },
      select: {
        content: true
      },
    })

    if (!workoutPlan) {
      return { error: "Plano de treino não encontrado" }
    }

    return { workoutPlan }

  } catch (error: any) {
    return { error: error.message }
  }
}