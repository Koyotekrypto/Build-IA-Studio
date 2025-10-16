import React, { useEffect, useState } from 'react';

interface NotificationProps {
  message: string | null;
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        // Allow time for fade out animation before calling onClose
        setTimeout(onClose, 300); 
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) {
      return null;
  }

  return (
    <div
      className={`fixed top-5 right-5 z-50 p-4 rounded-md shadow-lg text-white transition-transform duration-300 ${
        show ? 'translate-x-0' : 'translate-x-[calc(100%+2rem)]'
      } bg-green-500`}
      role="alert"
    >
      {message}
    </div>
  );
};
