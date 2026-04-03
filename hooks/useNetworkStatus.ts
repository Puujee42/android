'use client';

import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

interface NetworkStatus {
  isConnected: boolean;
  connectionType: string;
}

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    isConnected: true,
    connectionType: 'unknown',
  });

  useEffect(() => {
    // On native platforms, use Capacitor Network plugin
    if (Capacitor.isNativePlatform()) {
      let cleanup: (() => void) | undefined;

      (async () => {
        const { Network } = await import('@capacitor/network');

        // Get initial status
        const current = await Network.getStatus();
        setStatus({
          isConnected: current.connected,
          connectionType: current.connectionType,
        });

        // Listen for changes
        const listener = await Network.addListener('networkStatusChange', (s) => {
          setStatus({
            isConnected: s.connected,
            connectionType: s.connectionType,
          });
        });

        cleanup = () => {
          listener.remove();
        };
      })();

      return () => {
        cleanup?.();
      };
    }

    // On web, use navigator.onLine
    const handleOnline = () =>
      setStatus({ isConnected: true, connectionType: 'wifi' });
    const handleOffline = () =>
      setStatus({ isConnected: false, connectionType: 'none' });

    setStatus({
      isConnected: navigator.onLine,
      connectionType: navigator.onLine ? 'wifi' : 'none',
    });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return status;
}
