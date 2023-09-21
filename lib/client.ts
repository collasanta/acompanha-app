'use server'

import { auth } from "@clerk/nextjs"
import prismadb from "./prismadb"
import { programsFormSchema, programsFormSchemaType } from "@/types/programs"

export const checkClientByWhatsapp = async (clientWhatsapp: string) => {
    const { userId } = auth()

    if (!userId) {
        return false
    }

    const client = await prismadb.client.findUnique({
        where: { whatsapp: clientWhatsapp },
        select: {
            id: true,
        }
    })

    if (!client) {
        return undefined
    } else {
        return client
    }

}

export const createNewClient = async (clientWhatsapp: string, clientName: string) => {
    const { userId } = auth()
    if (!userId) {
        return false
    }

    try {
        const newClient = await prismadb.client.create({
            data: {
                name: clientName,
                whatsapp: clientWhatsapp,
                professionalId: userId
            },
        });
        console.log("Novo cliente criado: ", newClient)
        return newClient.id

    } catch (error:any) {
        return {
            erro: error.message
        }
    }
}

export const registerNewProgram = async (finalForm: programsFormSchemaType) => {
    let { userId } = auth()
    console.log("userId: ", userId)
    if (!userId) {
        return {
            erro: "no user Id"
        }
    }
    const typeCheck = programsFormSchema.safeParse(finalForm)
    if (!typeCheck.success) {
        return {
            erro: typeCheck.error.format()
        }
    }
    // PRIMEIRO CHECA SE O CLIENTE JÁ EXISTE
    const newClientId = await createNewClient(finalForm.clientWhatsapp, finalForm.clientName)

    return 
}
