import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import successAnimation from '../assets/lottie/success.json';
import errorAnimation from '../assets/lottie/error.json';
import infoAnimation from '../assets/lottie/info.json';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  }, []);

  const getAnimationData = (type: ToastType) => {
    switch (type) {
      case 'success':
        return successAnimation;
      case 'error':
        return errorAnimation;
      case 'info':
        return infoAnimation;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
      >
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className={`
                min-w-[300px] max-w-md p-4 rounded-lg shadow-lg flex items-center gap-3
                ${toast.type === 'success' && 'bg-yes text-background'}
                ${toast.type === 'error' && 'bg-no text-background'}
                ${toast.type === 'info' && 'bg-primary text-background'}
              `}
              role="alert"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <Lottie
                  animationData={getAnimationData(toast.type)}
                  loop={false}
                  autoplay={true}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              <p className="font-medium flex-1">{toast.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
