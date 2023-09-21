import { auth } from "@clerk/nextjs"
import prismadb from "./prismadb"

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

    const newClient = await prismadb.client.create({
        data: {
          name: clientName,
          whatsapp: clientWhatsapp,
          professionalId: userId
        },
      });
    
    console.log("Novo cliente criado: ", newClient);
      
    return newClient.id
}