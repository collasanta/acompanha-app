import { getAllWebPushSubscriptions } from '@/lib/pwa';
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

    console.log("subscriptions api: ", subscriptions)
    if (!subscriptions) {
        return NextResponse.json(
            { error: 'no subscriptions found' },
            { status: 500 },
        );
    }

    const Subs = JSON.parse(subscriptions)
    console.log("Subs: ", Subs)
    
    Subs.forEach((s:any) => {
        console.log("s: ", s)
        const payload = JSON.stringify({
          title: 'Seu Nutricionista quer saber como foi seu dia',
          body: 'Clique aqui para preencher o diário',
          icon: '/nutricionista.png',
        })
        //@ts-ignore
        const send = webpush.sendNotification(s?.subscription!, payload)

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