'use server'

import { auth } from "@clerk/nextjs"
import prismadb from "./prismadb"
import { generateId } from "./utils";
import { revalidatePath } from "next/cache";

export const checkClientByWhatsapp = async (clientWhatsapp: string) => {
    try {
        const client = await prismadb.client.findUnique({
            where: { whatsapp: clientWhatsapp },
            select: {
                id: true,
            }
        })

        if (!client) {
            return false
        } else {
            return client.id
        }

    } catch (error: any) {
        return {
            error: error.message
        }
    }

}

export const createNewClient = async (clientWhatsapp: string, clientName: string, userId: string) => {
    try {
        const newClient = await prismadb.client.create({
            data: {
                id: generateId(),
                name: clientName,
                whatsapp: clientWhatsapp,
                professionalId: userId
            },
        });
        console.log("Novo cliente criado: ", newClient)
        return newClient.id

    } catch (error: any) {
        return {
            error: error.message
        }
    }
}

export const getClientsByProfessional = async () => {
    const { userId } = auth()
    if (!userId) { return { error: "usuário não logado " } }
  
    try {
        const clients = await prismadb.client.findMany({
            where: { professionalId: userId }
        })
        return clients
    } catch (error: any) {
        return {
            error: error.message
        }
    }
}

export const getClient = async (clientId: string) => {
    const { userId } = auth()
    if (!userId) { return { error: "usuário não logado " } }

    try {
        const client = await prismadb.client.findUnique({
            where: { id: clientId },
            include: {
                dietPlans: true,
                currentDietPlan: true
            }
        })

        if (!client) {
            return {
                error: "Cliente não encontrado"
            }
        }

        if (client.professionalId !== userId) {
            return {
                error: "Cliente não pertence ao profissional"
            }
        }

        return client

    } catch (error: any) {
        return {
            error: error.message
        }
    }
}

export async function updateClientDiet(clientId: string, dietId: string) {
    try {
      const { userId } = auth()
      if (!userId) {
        return { error: "Usuário não autenticado" }
        } 
        
        const diet = await prismadb.dietPlan.findUnique({
        where: { id: dietId, professionalId: userId },
        })

        if (!diet) { 
            throw new Error("Dieta não encontrada ou não pertence ao usuário")
        }

        if (diet.clientId || diet.clientId !== clientId) {
            const newDiet = await prismadb.dietPlan.create({
                data: {
                    id: generateId(),
                    professionalId: userId,
                    clientId: clientId,
                    content: diet.content,
                    name: diet.name, 
                },
            });
            console.log(`Nova dieta criada (${newDiet.id}) - Clonada de ${dietId} `)
        }
        
        const updatedClient = await prismadb.client.update({
        where: { id: clientId, professionalId: userId },
        data: { currentDietPlanId: dietId },
        })
  
        revalidatePath(`/clients/${clientId}`)
        revalidatePath(`/clients`)
      return { success: true, client: updatedClient }
    } catch (error: any) {
      console.error("Error updating client diet:", error)
      return { error: error.message || "Erro ao atualizar dieta do cliente" }
    }
  }