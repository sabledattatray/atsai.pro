import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSQL } from '@/lib/db';

// Credits granted per plan
const PLAN_CREDITS: Record<string, number> = {
  starter: 10,
  pro: 50,
  enterprise: 200,
};
const DEFAULT_CREDITS = 10;

export async function POST(req: NextRequest) {
  try {
    const sql = getSQL();
    const rawBody = await req.text();
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
    const signature = req.headers.get('x-razorpay-signature');

    // Verify webhook signature if secret is configured
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
      case 'payment.captured': {
        const payment = body.payload?.payment?.entity;
        const uid: string | undefined = payment?.notes?.uid;
        const plan: string | undefined = payment?.notes?.plan;

        if (uid) {
          const credits = PLAN_CREDITS[plan || ''] ?? DEFAULT_CREDITS;
          await sql`
            UPDATE users
            SET credits = credits + ${credits}
            WHERE uid = ${uid}
          `;
          console.log(`✅ Payment captured: +${credits} credits for uid=${uid} (plan=${plan})`);
        } else {
          console.warn('payment.captured event missing uid in notes — skipping credit grant');
        }
        break;
      }

      case 'payment.failed':
        console.log('❌ Payment failed:', body.payload?.payment?.entity?.id);
        break;

      case 'subscription.cancelled': {
        const uid = body.payload?.subscription?.entity?.notes?.uid;
        if (uid) {
          await sql`UPDATE users SET credits = 3 WHERE uid = ${uid}`;
          console.log(`🔄 Subscription cancelled — credits reset for uid=${uid}`);
        }
        break;
      }

      case 'refund.created': {
        const uid = body.payload?.refund?.entity?.notes?.uid;
        const plan = body.payload?.refund?.entity?.notes?.plan;
        if (uid) {
          const credits = PLAN_CREDITS[plan || ''] ?? DEFAULT_CREDITS;
          await sql`
            UPDATE users
            SET credits = GREATEST(0, credits - ${credits})
            WHERE uid = ${uid}
          `;
          console.log(`💸 Refund: -${credits} credits for uid=${uid}`);
        }
        break;
      }

      default:
        console.log(`Unhandled Razorpay event: ${event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Razorpay webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
