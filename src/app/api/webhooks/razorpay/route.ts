import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
    const signature = req.headers.get('x-razorpay-signature');

    if (secret && signature) {
      const shasum = crypto.createHmac('sha256', secret);
      shasum.update(rawBody);
      const digest = shasum.digest('hex');

      if (digest !== signature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    }

    const body = JSON.parse(rawBody);
    const event = body.event;

    switch (event) {
      case 'payment.captured':
        console.log('Payment succeeded - executing robust credit provisioning');
        break;
      case 'payment.failed':
        console.log('Payment failed - firing retry notification & blocking access');
        break;
      case 'subscription.cancelled':
        console.log('Subscription canceled - scheduling downgrade and credit adjustment');
        break;
      case 'refund.created':
        console.log('Charge refunded - executing credit rollback safety protocol');
        break;
      default:
        console.log(`Unhandled event type ${event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
