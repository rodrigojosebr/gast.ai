"use client";

import { useState, useEffect } from "react";
import { css } from "../../styled-system/css";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true); // Default to true to prevent hydration mismatch/flashing

  useEffect(() => {
    // Check if already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    if (isIOSDevice && !standalone) {
      setIsInstallable(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSPrompt(true);
      return;
    }

    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  if (!isInstallable || isStandalone) return null;

  return (
    <>
      <button
        onClick={handleInstallClick}
        className={css({
          backgroundColor: '#007aff',
          color: 'white',
          border: 'none',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transition: 'background-color 0.2s, transform 0.2s',
          _hover: {
            backgroundColor: '#005bb5',
            transform: 'scale(1.05)',
          }
        })}
        aria-label="Instalar Aplicativo"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Instalar
      </button>

      {showIOSPrompt && (
        <div className={css({
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '20px',
          backgroundColor: '#1a1a1a',
          borderTop: '1px solid #333',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          zIndex: 1000,
          boxShadow: '0 -4px 12px rgba(0,0,0,0.5)',
          animation: 'slideUp 0.3s ease-out',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        })}>
          <button
            onClick={() => setShowIOSPrompt(false)}
            className={css({
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'none',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              padding: '5px'
            })}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <h3 style={{ marginTop: '10px', marginBottom: '15px', fontSize: '1.2rem', fontWeight: 'bold' }}>Instalar no iPhone</h3>
          
          <p style={{ marginBottom: '15px', color: '#ccc', fontSize: '0.9rem', lineHeight: '1.4' }}>
            Para instalar o Gast.ai na sua tela inicial, siga os passos abaixo:
          </p>
          
          <ol style={{ textAlign: 'left', marginBottom: '20px', fontSize: '0.95rem', color: '#fff', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '10px' }}>
              Toque no ícone de <strong>Compartilhar</strong> <svg style={{ display: 'inline', verticalAlign: 'middle', margin: '0 4px' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg> na barra inferior do Safari.
            </li>
            <li>
              Role para baixo e selecione <strong>"Adicionar à Tela de Início"</strong> <svg style={{ display: 'inline', verticalAlign: 'middle', margin: '0 4px' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>.
            </li>
          </ol>

          <button
            onClick={() => setShowIOSPrompt(false)}
            className={css({
              backgroundColor: '#333',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%',
              maxWidth: '300px'
            })}
          >
            Entendi
          </button>
        </div>
      )}
    </>
  );
};
