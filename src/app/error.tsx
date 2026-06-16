'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to the console in development; hook in a real error tracker here
    console.error('[Global Error Boundary]', error);
  }, [error]);

  return (
    <main className="error-root">
      <div className="error-card">
        <div className="error-icon" aria-hidden="true">⚠</div>

        <h1 className="error-title">Something went wrong</h1>
        <p className="error-description">
          An unexpected error occurred. We&apos;ve been notified and will look
          into it. You can try again or head back to the home page.
        </p>

        {process.env.NODE_ENV !== 'production' && error.message && (
          <pre className="error-details">{error.message}</pre>
        )}

        <div className="error-actions">
          <button
            type="button"
            className="error-btn btn-primary"
            onClick={reset}
          >
            ↺ Try Again
          </button>
          <Link href="/" className="error-btn btn-secondary">
            ← Back to Home
          </Link>
        </div>
      </div>

      <style>{`
        .error-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(ellipse at 50% 0%, hsl(0 50% 10%) 0%, hsl(230 40% 6%) 100%);
          padding: 2rem;
          font-family: var(--font-sans, system-ui, sans-serif);
        }
        .error-card {
          max-width: 520px;
          width: 100%;
          text-align: center;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,80,80,0.18);
          border-radius: 24px;
          padding: 3.5rem 3rem;
          backdrop-filter: blur(20px);
          box-shadow: 0 32px 80px rgba(0,0,0,0.5), 0 0 60px hsl(0 80% 50% / 0.08);
        }
        .error-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          display: block;
          filter: drop-shadow(0 0 16px hsl(0 80% 60% / 0.6));
        }
        .error-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: hsl(220 20% 95%);
          margin: 0 0 1rem;
          font-family: var(--font-display, system-ui, sans-serif);
        }
        .error-description {
          color: hsl(220 15% 60%);
          line-height: 1.65;
          margin: 0 0 1.5rem;
          font-size: 1rem;
        }
        .error-details {
          background: rgba(255,60,60,0.08);
          border: 1px solid rgba(255,60,60,0.2);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          font-size: 0.8rem;
          color: hsl(0 70% 70%);
          text-align: left;
          overflow-x: auto;
          white-space: pre-wrap;
          word-break: break-word;
          margin-bottom: 1.5rem;
          font-family: var(--font-mono, monospace);
        }
        .error-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .error-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.65rem 1.5rem;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
          white-space: nowrap;
          border: none;
        }
        .btn-primary {
          background: linear-gradient(135deg, hsl(0 70% 50%) 0%, hsl(20 80% 50%) 100%);
          color: #fff;
          box-shadow: 0 4px 20px hsl(0 70% 50% / 0.4);
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px hsl(0 70% 50% / 0.55);
        }
        .btn-secondary {
          background: rgba(255,255,255,0.06);
          color: hsl(220 20% 80%);
          border: 1px solid rgba(255,255,255,0.12) !important;
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
