import { PrismaClient } from '@prisma/client'
import webpush from 'web-push'

const prismadb = new PrismaClient()

export const cron = async () => {
  try {
    webpush.setVapidDetails(
      'mailto:contato@diario.fit',
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    )
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

    if (!subscriptions) {
      console.log("no subscriptions found")
      return
    }

    let messagesSent = 0
    subscriptions.map(async (s) => {
      if(s.clientId === "c-z3o65scikf7"){

        const payload = JSON.stringify({
          title: `Preencheu o diário hoje ${s.client.name.split(" ")[0].toLocaleLowerCase()}? 👀`,
          body: `${s.program.professional.name.split(" ")[0]} quer saber como está indo a dieta! 🗓🥦💪`,
          icon: '/nutricionista.png',
          data: { subscriptionId: s.id }
        })
        //@ts-ignore
        try {
          const send = await webpush.sendNotification(s.subscription, payload)
          if (send.statusCode === 201 || send.statusCode === 200) {
            messagesSent++
            const subscription = await prismadb.webPushSubscriptions.update({
              where: {
                id: s.id
              },
              data: {
                notificationsSent: {
                  increment: 1
                }
              },
            });
            console.log("subscription: ", subscription.id, " sent updated")
          }
        } catch (error) {
          console.log("erro ao enviar notificação sub", s.id, " ", error.message)
        }
      }
    })

    return
  }
  catch (error) {
    console.error('Erro Geral', error.message);
  }


  await prismadb.$disconnect()
}



