'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { auth } from '@/lib/firebase';

declare global {
  interface Window { Razorpay: any; }
}

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<'basic' | 'pro' | null>(null);

  const handleCheckout = async (plan: 'basic' | 'pro') => {
    setLoadingPlan(plan);
    try {
      const user = auth?.currentUser;
      if (!user) {
        window.location.href = '/sign-in';
        return;
      }
      const uid = user.uid;
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, uid }),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; return; }
      if (data.orderId) {
        const options = {
          key: data.keyId,
          amount: data.amount,
          currency: data.currency,
          name: 'Resume Copilot AI',
          description: plan === 'pro' ? 'Pro \u2014 Unlimited Scans' : 'Starter \u2014 10 Premium Scans',
          order_id: data.orderId,
          handler: async (response: any) => {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const v = await verifyRes.json();
            if (v.success) {
              window.location.href = '/app?payment_success=true';
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          },
          prefill: {
            name: user.displayName || '',
            email: user.email || '',
            contact: '',
          },
          theme: { color: '#6366f1' },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else if (data.error) {
        alert('Payment error: ' + data.error);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Could not initiate payment. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)] py-24 px-4 bg-[#030712] text-slate-100 relative overflow-hidden">
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight leading-none">Simple, Transparent Pricing</h1>
          <p className="text-slate-400 max-w-xl mx-auto font-medium">Start for free, upgrade when you&apos;re ready to unlock advanced AI capabilities and unlimited scans.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {/* Free Tier */}
          <motion.div
            initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="bg-[#0b0f19]/35 backdrop-blur-md p-8 border border-white/5 rounded-2xl flex flex-col relative shadow-2xl shadow-black/45"
          >
            <h3 className="text-lg font-bold mb-2 text-white">Free</h3>
            <div className="text-4xl font-black mb-1 font-mono text-white">&#8377;0</div>
            <p className="text-xs text-slate-500 font-mono mb-6">Forever free</p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-sm text-slate-300 font-semibold"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> 3 Semantic ATS Scans</li>
              <li className="flex gap-3 text-sm text-slate-300 font-semibold"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> Basic Skill Gap Detection</li>
              <li className="flex gap-3 text-sm text-slate-300 font-semibold"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> PDF Report Export</li>
            </ul>
            <Link href="/app">
              <Button variant="outline" className="w-full h-11 text-[10px] tracking-wider font-bold">Get Started</Button>
            </Link>
          </motion.div>

          {/* Credit Pack */}
          <motion.div
            initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-slate-950/80 backdrop-blur-md p-8 border-2 border-indigo-500 rounded-2xl flex flex-col relative shadow-[0_0_35px_rgba(99,102,241,0.15)]"
          >
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-indigo-500 text-white text-[8px] uppercase tracking-widest font-mono font-bold px-3 py-1 rounded shadow-md">Popular</div>
            <h3 className="text-lg font-bold mb-2 text-indigo-400">Credit Pack</h3>
            <div className="text-4xl font-black mb-1 font-mono text-white">&#8377;500<span className="text-sm font-semibold text-slate-500 tracking-wider font-sans uppercase">/10 scans</span></div>
            <p className="text-xs text-slate-500 font-mono mb-6">One-time purchase</p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-sm text-slate-100 font-extrabold"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> 10 Premium ATS Scans</li>
              <li className="flex gap-3 text-sm text-slate-100 font-extrabold"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> Advanced Skill Matching</li>
              <li className="flex gap-3 text-sm text-slate-100 font-extrabold"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> AI Bullet Rewrites</li>
              <li className="flex gap-3 text-sm text-slate-100 font-extrabold"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> Explainability Feedback</li>
            </ul>
            <Button
              id="buy-credits-btn"
              onClick={() => handleCheckout('basic')}
              disabled={loadingPlan !== null}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 font-bold text-[10px] tracking-wider cursor-pointer"
            >
              {loadingPlan === 'basic' ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Buy Credits \u2014 \u20b9500'}
            </Button>
          </motion.div>

          {/* Pro Tier */}
          <motion.div
            initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-b from-[#0b0f19] to-slate-950 p-8 border border-white/10 rounded-2xl flex flex-col relative py-12 shadow-2xl shadow-black/45"
          >
            <Zap className="w-6 h-6 text-yellow-400 mb-4" />
            <h3 className="text-lg font-bold mb-2 text-white">Pro Unlimited</h3>
            <div className="text-4xl font-black mb-1 font-mono text-white">&#8377;1,900<span className="text-sm font-semibold text-slate-500 tracking-wider font-sans uppercase">/month</span></div>
            <p className="text-xs text-slate-500 font-mono mb-6">Cancel anytime</p>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-sm text-slate-300 font-semibold"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> Unlimited ATS Scans</li>
              <li className="flex gap-3 text-sm text-slate-300 font-semibold"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> Unlimited AI Rewrites</li>
              <li className="flex gap-3 text-sm text-slate-300 font-semibold"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> Priority Support</li>
              <li className="flex gap-3 text-sm text-slate-300 font-semibold"><CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" /> Multi-Resume Compare</li>
            </ul>
            <Button
              id="upgrade-pro-btn"
              onClick={() => handleCheckout('pro')}
              disabled={loadingPlan !== null}
              className="w-full h-11 bg-white text-black hover:bg-slate-200 font-bold text-[10px] tracking-wider cursor-pointer"
            >
              {loadingPlan === 'pro' ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Upgrade to Pro \u2014 \u20b91,900'}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
