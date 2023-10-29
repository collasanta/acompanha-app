import { getAllWebPushSubscriptions, trackNotificationSent } from '@/lib/pwa';
import { WebPushNotificationDataType } from '@/types/notifications';
import { NextResponse } from 'next/server'
import webpush from 'web-push'

export const dynamic = 'force-dynamic'

export async function GET() {
    webpush.setVapidDetails(
        'mailto:contato@diario.fit',
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        process.env.VAPID_PRIVATE_KEY!
      )
  try {

    const subscriptions = await getAllWebPushSubscriptions()

    if (!subscriptions) {
        return NextResponse.json(
            { error: 'no subscriptions found' },
            { status: 500 },
        );
    }

    const Subs = JSON.parse(subscriptions)
    
    Subs.map(async (s:WebPushNotificationDataType) => {
        if (s.id === "68f23b2e-b135-4268-b400-c970f119fab8"){
          const payload = JSON.stringify({
            title: `${s.client.name.split(" ")[0]}, já preencheu hoje? 👀`,
            body:`Nutricionista ${s.program.professional.name.split(" ")[0]} quer saber como está indo o programa!`,
            icon: '/nutricionista.png',
            data: {subscriptionId:"68f23b2e-b135-4268-b400-c970f119fab8"}
          })
          //@ts-ignore
          try {
              const send = await webpush.sendNotification(s?.subscription!, payload)
              if (send.statusCode === 201 || send.statusCode === 200){
                await trackNotificationSent(s.id)
              }
          } catch (error) {
              console.log("error: ", error)
          }
        }
      })
    
      return NextResponse.json(
        { message: `messages sent` },
        { status: 200 },
      );
    }
   catch (error) {
    console.error('Error sending messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch' },
      { status: 500 },
    );
  }
}