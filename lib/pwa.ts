'use server'
import prismadb from "./prismadb"

export async function saveWebPushSubscription(subscription: string, programId: string, device: string) {
  
  const clientId = await prismadb.program.findFirst({
    where: {
      id: programId
    },
    select: {
      clientId: true
    }
  })

  console.log("New Subscription Saving Proccess Started in device:", device)
  
  

  const newSubscription = await prismadb.webPushSubscriptions.create({
    data: {
      programId: programId,
      subscription: JSON.parse(subscription),
      clientId: clientId?.clientId!,
      device: device
    }
  })

  console.log("new sub saved in database: ", newSubscription)
}

export async function getAllWebPushSubscriptions() {
  const subscriptions = await prismadb.webPushSubscriptions.findMany({
    include: {
      client: {
        select: {
          name: true
        }
      },
      program: {
        select: {
          professional: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });


  const stringSubs = JSON.stringify(subscriptions)

  return stringSubs
}




