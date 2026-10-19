import React, { useEffect, useState } from 'react';
import { Cloud, CloudOff, CheckCircle2, Bell } from 'lucide-react';

interface ToastMessage {
  id: string;
  message: string;
  type: 'sync' | 'reminder' | 'offline';
}

interface SyncNotificationProps {
  isOffline: boolean;
  notificationMessage: string | null;
  onClearNotification: () => void;
}

export const SyncNotification: React.FC<SyncNotificationProps> = ({
  isOffline,
  notificationMessage,
  onClearNotification
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    if (notificationMessage) {
      const newToast: ToastMessage = {
        id: Math.random().toString(),
        message: notificationMessage,
        type: 'reminder'
      };
      setToasts(prev => [...prev.slice(-2), newToast]);
      const timer = setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
        onClearNotification();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [notificationMessage, onClearNotification]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-slate-900/90 text-white px-4 py-2.5 rounded-2xl border border-amber-400/40 shadow-xl flex items-center gap-3 animate-fadeIn text-xs"
        >
          <Bell className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-medium">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
