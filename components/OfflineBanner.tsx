'use client';

import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflineBanner() {
  const { isConnected } = useNetworkStatus();

  return (
    <AnimatePresence>
      {!isConnected && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="bg-gradient-to-r from-[#FF3B30] to-[#FF6B35] px-4 py-3 flex items-center justify-center gap-3 shadow-lg relative z-[9999]">
            <WifiOff className="w-4 h-4 text-white/90 flex-shrink-0" strokeWidth={2.5} />
            <span className="text-white text-[13px] font-semibold tracking-tight">
              Интернэт холболтгүй байна
            </span>
            <button
              onClick={() => window.location.reload()}
              className="ml-2 flex items-center gap-1.5 bg-white/20 hover:bg-white/30 active:scale-95 rounded-full px-3 py-1 transition-all"
            >
              <RefreshCw className="w-3 h-3 text-white" strokeWidth={2.5} />
              <span className="text-white text-[11px] font-bold">Дахин оролдох</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
