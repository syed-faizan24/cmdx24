import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: { id: string, message: string, type: string }, onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-brand-primary" />,
    error: <AlertCircle className="w-5 h-5 text-brand-alert" />,
    info: <Info className="w-5 h-5 text-gray-400" />
  };

  const borderColors = {
    success: 'border-brand-primary/50',
    error: 'border-brand-alert/50',
    info: 'border-bg-active'
  };

  return (
    <div className={`flex items-start gap-3 p-4 bg-bg-surface border ${borderColors[toast.type as keyof typeof borderColors]} shadow-lg animate-in slide-in-from-bottom-5 fade-in duration-300`}>
      {icons[toast.type as keyof typeof icons]}
      <p className="text-sm font-mono text-gray-200 mt-0.5 flex-1">{toast.message}</p>
      <button onClick={onDismiss} className="text-gray-500 hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
