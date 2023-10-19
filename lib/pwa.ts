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

  const newSubscription = await prismadb.webPushSubscriptions.create({
    data: {
      programId: programId,
      subscription: subscription,
      clientId: clientId?.clientId!,
      device: device
    }
  })

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