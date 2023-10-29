import { getAllWebPushSubscriptions, trackNotificationSent } from '@/lib/pwa';
import { WebPushNotificationDataType } from '@/types/notifications';
import { NextResponse } from 'next/server'
import webpush from 'web-push'

export const dynamic = 'force-dynamic'

export async function GET(req: Request, res: Response) {
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 500 },
    );
  }
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

    Subs.map(async (s: WebPushNotificationDataType) => {
      const payload = JSON.stringify({
        title: `Preencheu o diário hoje ${s.client.name.split(" ")[0].toLocaleLowerCase()}? 👀`,
        body: `${s.program.professional.name.split(" ")[0]} quer saber como está indo a dieta! 🗓🥦💪`,
        icon: '/nutricionista.png',
        data: { subscriptionId: s.id }
      })
      //@ts-ignore
      try {
        const send = await webpush.sendNotification(s?.subscription!, payload)
        console.log("send: ", send)
        if (send.statusCode === 201 || send.statusCode === 200) {
          await trackNotificationSent(s.id)
        }
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
      { error: 'Failed to fetch' },
      { status: 500 },
    );
  }
}