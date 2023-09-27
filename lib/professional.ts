'use server'

import { auth, clerkClient } from "@clerk/nextjs"
import prismadb from "./prismadb"
import { professionalFormType } from "@/types/professionals"

export const isNewUser = async () => {
    const { userId } = auth()
    if (!userId) {return { erro: "user not logged in" }}

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
    if (!userId) {return { erro: "user not logged in" }}

    try {
        const user = await clerkClient.users.getUser(userId!)
        const email = user.emailAddresses[0].emailAddress
        const newProfessional = await prismadb.professional.create({
            data: {
                name: formData.professionalName,
                profession: formData.professionalJob,
                id: userId,
                avgClientsSurvey: formData.professionalAvgClientsSurvey,
                email: email,
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



