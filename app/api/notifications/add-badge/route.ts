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
        if (s.id === "3733f2ba-d2f2-4c31-b646-c782b583f742"){
          const payload = JSON.stringify({
            title: `badge`,
            data: {subscriptionId: s.id}
          })
          //@ts-ignore
          try {
              const send = await webpush.sendNotification(s?.subscription!, payload)
              console.log("send: ", send)
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