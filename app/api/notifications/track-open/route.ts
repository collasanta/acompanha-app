import { trackNotificationOpen } from '@/lib/pwa';
import { NextResponse} from 'next/server'

export async function POST(request: Request) {
  try {
    const req = await request.json()

    const { subscriptionId } = req; // Extract the subscriptionId from the request body

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is missing' },
        { status: 400 } // Bad Request
      );
    }

    const saveDB = await trackNotificationOpen(subscriptionId);

    if (saveDB.openedNotifications) {
      return NextResponse.json(
        { message: `Opened notification tracked for subscription ID: ${subscriptionId}` },
        { status: 200 } // Success
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to track notification open' },
        { status: 500 } // Internal Server Error
      );
    }
  } catch (error) {
    console.error('Error tracking notification open:', error);
    return NextResponse.json(
      { error: 'Failed to track notification open' },
      { status: 500 } // Internal Server Error
    );
  }
}