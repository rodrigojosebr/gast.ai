"use client";

import { useState, useRef, useEffect, useCallback } from 'react';

interface UseSpeechRecognitionReturn {
  isRecording: boolean;
  transcript: string;
  setTranscript: (text: string) => void;
  startRecording: () => void;
  stopRecording: () => void;
  isSupported: boolean;
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  
  const recognitionRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.lang = 'pt-BR';
        recognitionRef.current.interimResults = true;
        recognitionRef.current.maxAlternatives = 1;

        recognitionRef.current.onstart = () => {
          setIsRecording(true);
        };

        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);

          // Reinicia o timeout de silêncio a cada novo resultado
          if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
          
          silenceTimeoutRef.current = setTimeout(() => {
            if (recognitionRef.current) {
              recognitionRef.current.stop();
            }
          }, 2000); // 2 segundos de silêncio encerram a gravação
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsRecording(false);
          if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
          if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
        };
      } else {
        setIsSupported(false);
      }
    }

    return () => {
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const startRecording = useCallback(() => {
    if (recognitionRef.current && !isRecording) {
      setTranscript('');
      recognitionRef.current.start();
    }
  }, [isRecording]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  }, [isRecording]);

  return {
    isRecording,
    transcript,
    setTranscript,
    startRecording,
    stopRecording,
    isSupported
  };
}
