"use server"

import { auth } from "@clerk/nextjs/server"
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
      include: {
        client: true,
      }
    })

    if (!workoutPlan) {
      return { error: "Plano de treino não encontrado" }
    }

    return { workoutPlan }

  } catch (error: any) {
    return { error: error.message }
  }
}

export const deleteWorkout = async (workoutId: string) => {
  try {
    let { userId } = auth()
    if (!userId) { 
      return { status: "error", error: "Usuário não logado" }
    }

    // Check if the workout belongs to the user
    const workout = await prismadb.workoutPlan.findUnique({
      where: {
        id: workoutId,
        professionalId: userId,
      },
    })

    if (!workout) {
      return { status: "error", error: "Treino não encontrado ou não pertence ao usuário" }
    }

    // Delete the workout
    const isDeleted = await prismadb.workoutPlan.delete({
      where: {
        id: workoutId,
      },
    })

    console.log("isDeleted", isDeleted)

    if (!isDeleted) {
      return { status: "error", error: "Erro ao deletar treino" }
    }
    // Revalidate the workouts page
    revalidatePath('/workouts')

    return { status: "deleted" }

  } catch (error: any) {
    return { status: "error", error: error.message }
  }
}

export async function updateWorkoutContent(workoutId: string, content: string) {
  try {
    const { userId } = auth();
    if (!userId) {
      return { error: "Unauthorized" };
    }

    const updatedWorkout = await prismadb.workoutPlan.update({
      where: {
        id: workoutId,
        professionalId: userId,
      },
      data: {
        content,
      },
    });

    revalidatePath(`/workouts/${workoutId}`);
    return { success: true, workout: updatedWorkout };
  } catch (error) {
    console.error("Error updating workout content:", error);
    return { error: "Failed to update workout content" };
  }
}