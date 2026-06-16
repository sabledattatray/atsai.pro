import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    const secret = process.env.RAZORPAY_KEY_SECRET || '';

    if (!secret) {
      return NextResponse.json({ error: 'Payment verification secret is not configured.' }, { status: 500 });
    }

    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest === razorpay_signature) {
      return NextResponse.json({ success: true, message: 'Payment verified' });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
