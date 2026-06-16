import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found',
  description: 'The page you are looking for does not exist.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="not-found-root">
      <div className="not-found-card">
        {/* Glowing orb decoration */}
        <div className="not-found-orb" aria-hidden="true" />

        <div className="not-found-code" aria-hidden="true">404</div>

        <h1 className="not-found-title">Page Not Found</h1>
        <p className="not-found-description">
          The page you&apos;re looking for has moved, been deleted, or never
          existed. Double-check the URL or head back somewhere safe.
        </p>

        <div className="not-found-actions">
          <Link href="/" className="btn-primary not-found-btn">
            ← Back to Home
          </Link>
          <Link href="/app" className="btn-secondary not-found-btn">
            Go to Dashboard
          </Link>
        </div>
      </div>

      <style>{`
        .not-found-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(ellipse at 50% 0%, hsl(230 60% 12%) 0%, hsl(230 40% 6%) 100%);
          padding: 2rem;
          font-family: var(--font-sans, system-ui, sans-serif);
          position: relative;
          overflow: hidden;
        }
        .not-found-card {
          position: relative;
          max-width: 520px;
          width: 100%;
          text-align: center;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 3.5rem 3rem;
          backdrop-filter: blur(20px);
          box-shadow: 0 32px 80px rgba(0,0,0,0.5);
        }
        .not-found-orb {
          position: absolute;
          top: -120px;
          left: 50%;
          transform: translateX(-50%);
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, hsl(250 80% 55% / 0.35) 0%, transparent 70%);
          pointer-events: none;
          animation: orb-pulse 4s ease-in-out infinite;
        }
        @keyframes orb-pulse {
          0%, 100% { opacity: 0.6; transform: translateX(-50%) scale(1); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.1); }
        }
        .not-found-code {
          font-size: clamp(5rem, 18vw, 8rem);
          font-weight: 900;
          line-height: 1;
          background: linear-gradient(135deg, hsl(250 80% 75%) 0%, hsl(200 80% 65%) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.05em;
          margin-bottom: 0.5rem;
          font-family: var(--font-display, system-ui, sans-serif);
        }
        .not-found-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: hsl(220 20% 95%);
          margin: 0 0 1rem;
          font-family: var(--font-display, system-ui, sans-serif);
        }
        .not-found-description {
          color: hsl(220 15% 60%);
          line-height: 1.65;
          margin: 0 0 2.5rem;
          font-size: 1rem;
        }
        .not-found-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .not-found-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.65rem 1.5rem;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .btn-primary {
          background: linear-gradient(135deg, hsl(250 80% 60%) 0%, hsl(270 70% 55%) 100%);
          color: #fff;
          border: none;
          box-shadow: 0 4px 20px hsl(250 80% 60% / 0.4);
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px hsl(250 80% 60% / 0.55);
        }
        .btn-secondary {
          background: rgba(255,255,255,0.06);
          color: hsl(220 20% 80%);
          border: 1px solid rgba(255,255,255,0.12);
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
          transform: translateY(-2px);
        }
      `}</style>
    </main>
  );
}
