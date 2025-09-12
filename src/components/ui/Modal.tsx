import { ReactNode, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  hideCloseButton?: boolean;
  onClose: () => void;
}

export const Modal = ({ isOpen, onClose, title, children, size = 'md', hideCloseButton = false }: ModalProps) => {
  useEffect(() => {
    if (isOpen)
      document.body.style.overflow = 'hidden';
    else
      document.body.style.overflow = 'unset';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center m-0">
      {/* Backdrop with blur effect - this stays behind the modal */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal content - this stays in focus */}
      <div className={`relative bg-white rounded-xl p-6 mx-4 w-full ${sizes[size]} max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200`}>
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            {!hideCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                ×
              </button>
            )}
          </div>
        )}
        <div className="text-gray-800">
          {children}
        </div>
      </div>
    </div>
  );
};