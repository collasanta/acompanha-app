'use server'

import { auth } from "@clerk/nextjs"
import prismadb from "./prismadb"
import { programsFormSchema, programsFormSchemaType } from "@/types/programs"
import { generateId } from "./utils";

const checkClientByWhatsapp = async (clientWhatsapp: string) => {
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

const createNewClient = async (clientWhatsapp: string, clientName: string, userId: string) => {
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

export const registerNewProgram = async (finalForm: programsFormSchemaType) => {
    try {
        let { userId } = auth()
        if (!userId) { return { erro: "not authenticated" } }


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

        return { programId: newProgram.id }

    } catch (error: any) {
        return { erro: error.message }
    }
}
