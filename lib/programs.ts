"use server"

import { auth } from "@clerk/nextjs"
import prismadb from "./prismadb"

export const getUserPrograms = async () => {
    const { userId } = auth()
    if (!userId) {
        return false
    }

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
        
        console.log("Programas do usuário: ", programs)
        return { userPrograms: programs }
    } catch (error: any) {
        return { erro: error.message }
    }
}

