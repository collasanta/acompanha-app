'use server'

import { auth } from "@clerk/nextjs"
import prismadb from "./prismadb"
import { programsFormSchema, programsFormSchemaType } from "@/types/programs"
import { generateId } from "./utils";
import { error } from "console";

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
            erro: error.message
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
            erro: error.message
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


