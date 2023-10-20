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
    select: {
      subscription: true
    }
  })

  const stringSubs = JSON.stringify(subscriptions)

  return stringSubs
}

export const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

