import { getAllWebPushSubscriptions, trackNotificationSent } from '@/lib/pwa';
import { WebPushNotificationDataType } from '@/types/notifications';
import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  console.log("headers",  request.headers)
  console.log("authHeader", authHeader)
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 },
    );
  }
  try {
    webpush.setVapidDetails(
      'mailto:contato@diario.fit',
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!
    )
    const subscriptions = await getAllWebPushSubscriptions()

    if (!subscriptions) {
      return NextResponse.json(
        { error: 'no subscriptions found' },
        { status: 500 },
      );
    }

    const Subs = await JSON.parse(subscriptions)
    let messagesSent = 0
    await Subs.map(async (s: WebPushNotificationDataType) => {
      const payload = JSON.stringify({
        title: `Preencheu o diário hoje ${s.client.name.split(" ")[0].toLocaleLowerCase()}? 👀`,
        body: `${s.program.professional.name.split(" ")[0]} quer saber como está indo a dieta! 🗓🥦💪`,
        icon: '/nutricionista.png',
        data: { subscriptionId: s.id }
      })
      //@ts-ignore
      try {
        const send = await webpush.sendNotification(s?.subscription!, payload)
        console.log("send: ", send.statusCode)
        if (send.statusCode === 201 || send.statusCode === 200) {
          messagesSent++
          await trackNotificationSent(s.id)
        }
      } catch (error:any) {
        console.log("error: ", error)
        return NextResponse.json(
          { error: `1) ${error.message}`},
          { status: 500 },
        );
      }
    })

    return NextResponse.json(
      { message: `${messagesSent} notifications sent` },
      { status: 200 },
    );
  }
  catch (error:any) {
    console.error('Error sending messages:', error);
    return NextResponse.json(
      { error: `2) ${error.message}`},
      { status: 500 },
    );
  }
}