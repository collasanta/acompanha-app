import { PrismaClient } from '@prisma/client'
import webpush from 'web-push'

const prismadb = new PrismaClient()

export const cron = async () => {
  console.log("cron job started")
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
      return `no subs found`
    }

    let messagesSent = 0
    const promises = [];
    subscriptions.map((s) => {
        console.log("entrou")
        const payload = JSON.stringify({
          title: `Preencheu o diário hoje ${s.client.name.split(" ")[0].toLocaleLowerCase()}? 👀`,
          body: `${s.program.professional.name.split(" ")[0]} quer saber como está indo a dieta! 🗓🥦💪`,
          icon: '/nutricionista.png',
          data: { subscriptionId: s.id }
        })
        //@ts-ignore
        try {
          console.log("antes do send")
          const send = webpush.sendNotification(s.subscription, payload)
          promises.push(send);
          console.log("send", send)
          if (send.statusCode === 201 || send.statusCode === 200) {
            console.log("entrou if send status")
            messagesSent++
            const subscription = prismadb.webPushSubscriptions.update({
              where: {
                id: s.id
              },
              data: {
                notificationsSent: {
                  increment: 1
                }
              },
            });
            promises.push(subscription);
            console.log("subscription: ", subscription.id, " sent updated")
          }
        } catch (error) {
          console.log("erro ao enviar notificação sub", " ", error.message)
          return `erro ao enviar notificação sub ${s.id} :  ${error.message}`
        }
    })

    await Promise.all(promises);
    console.log("promises", promises)

    await prismadb.$disconnect()

    return `${messagesSent} notifications sent.`
  }
  catch (error) {
    console.error('Erro Geral: ', error.message );
    return `Erro Geral ${error.message}`
  }
}



