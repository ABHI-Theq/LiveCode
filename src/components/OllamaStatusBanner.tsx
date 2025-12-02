"use client"

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface OllamaStatus {
  available: boolean;
  error?: string;
  checking: boolean;
}

export function OllamaStatusBanner() {
  const [status, setStatus] = useState<OllamaStatus>({
    available: false,
    checking: true,
    error: undefined
  });
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Only check Ollama in development (localhost)
    // In production, Ollama won't be accessible from browser
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      checkOllama();
      // Check every 30 seconds
      const interval = setInterval(checkOllama, 30000);
      return () => clearInterval(interval);
    } else {
      // In production, don't show banner (Ollama is server-side only)
      setStatus({ available: true, checking: false });
    }
  }, []);

  async function checkOllama() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch('http://127.0.0.1:11434/api/tags', {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        setStatus({ available: true, checking: false });
      } else {
        setStatus({
          available: false,
          checking: false,
          error: 'Ollama is not responding correctly'
        });
      }
    } catch (error) {
      setStatus({
        available: false,
        checking: false,
        error: 'Ollama is not running. AI suggestions will not work.'
      });
    }
  }

  // Don't show if dismissed or still checking
  if (dismissed || status.checking) {
    return null;
  }

  // Show warning if Ollama is not available
  if (!status.available) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Ollama Not Available
            </h3>
            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              <p>
                {status.error || 'AI code suggestions require Ollama to be running locally.'}
              </p>
              <p className="mt-1">
                Please start Ollama or install it from{' '}
                <a
                  href="https://ollama.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline hover:text-yellow-600"
                >
                  ollama.ai
                </a>
              </p>
            </div>
          </div>
          <div className="ml-auto pl-3">
            <button
              onClick={() => setDismissed(true)}
              className="inline-flex text-yellow-400 hover:text-yellow-600 focus:outline-none"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Optionally show success message (can be removed if you don't want it)
  return null;
}
