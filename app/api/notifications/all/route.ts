import { getAllWebPushSubscriptions } from '@/lib/pwa';
import { WebPushNotificationDataType } from '@/types/notifications';
import { NextResponse, NextRequest } from 'next/server'
import webpush, { PushSubscription } from 'web-push'

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
        console.log("s: ", s)
        const payload = JSON.stringify({
          title: `${s.client.name.split(" ")[0]}, já preencheu hoje? 👀`,
          body:`Nutricionista ${s.program.professional.name.split(" ")[0]} quer saber como está indo o programa!`,
          icon: '/nutricionista.png',
        })
        //@ts-ignore
        try {
            const send = await webpush.sendNotification(s?.subscription!, payload)
            console.log("send: ", send)
        } catch (error) {
            console.log("error: ", error)
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
      { error: 'Failed to fetch exchange rate' },
      { status: 500 },
    );
  }
}