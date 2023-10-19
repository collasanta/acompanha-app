'use server'
import prismadb from "./prismadb"

export async function saveWebPushSubscription(subscription: PushSubscription, programId: string, device: string) {
  
  const clientId = await prismadb.program.findFirst({
    where: {
      id: programId
    },
    select: {
      clientId: true
    }
  })

  console.log("New Subscription Saving Proccess Started in device":, device)
  
  const newSubscription = await prismadb.webPushSubscriptions.create({
    data: {
      programId: programId,
      subscription: subscription,
      clientId: clientId?.clientId!,
      device: device
    }
  })

  console.log("sub saving database result: ", newSubscription)
  return newSubscription
}

export async function getAllWebPushSubscriptions() {
  const subscriptions = await prismadb.webPushSubscriptions.findMany({
    select: {
      subscription: true
    }
  })
  return subscriptions
}