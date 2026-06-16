import { NextRequest, NextResponse } from 'next/server';
import { getRazorpay } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      // Fallback to mock session if keys don't exist
      return NextResponse.json({ url: '/app?payment_success=true' });
    }

    const { plan, uid } = await req.json();
    const amount = plan === 'pro' ? 1900 : 500;

    const razorpay = getRazorpay();
    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `rcpt_${Math.random().toString(36).substring(2, 10)}`,
      notes: {
        uid: uid || '',
        plan: plan || 'starter',
      }
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID || ''
    });
  } catch (error: any) {
    console.error('Razorpay error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
