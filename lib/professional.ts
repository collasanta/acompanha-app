'use server'

import { auth } from "@clerk/nextjs"
import prismadb from "./prismadb"
import { professionalFormType } from "@/types/professionals"

export const isNewUser = async () => {
    const { userId } = auth()
    if (!userId) {
        return false
    }
    const professional = await prismadb.professional.findUnique({
        where: { id: userId },
    })
    if (!professional) {
        return true
    } else {
        return false
    }
}

export const createNewProfessional = async (formData: professionalFormType) => {
    const { userId } = auth()
    if (!userId) {
        return false
    }

    try {
        const newProfessional = await prismadb.professional.create({
            data: {
                name: formData.professionalName,
                profession: formData.professionalJob,
                id: userId,
                avgClientsSurvey: formData.professionalAvgClientsSurvey,
                email: formData.email,
                whatsapp: formData.whatsapp,
            },
        });
        console.log("Novo profissional criado: ", newProfessional)
        return true

    } catch (error: any) {
        return {
            erro: error.message
        }
    }
}



