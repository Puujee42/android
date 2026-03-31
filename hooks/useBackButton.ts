import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

export const useBackButton = () => {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const addListener = async () => {
      const handler = await App.addListener('backButton', ({ canGoBack }) => {
        if (canGoBack) {
          window.history.back();
        } else {
          App.exitApp();
        }
      });
      return handler;
    };

    const handlerPromise = addListener();

    return () => {
      handlerPromise.then(h => h.remove());
    };
  }, []);
};
