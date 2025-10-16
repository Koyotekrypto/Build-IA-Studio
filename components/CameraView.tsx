import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CloseIcon, CaptureIcon, SpinnerIcon } from './icons/Icons';

interface CameraViewProps {
  onClose: () => void;
  onPhotoCaptured: (file: File) => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onClose, onPhotoCaptured }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCameraStream = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Não foi possível acessar a câmera. Verifique as permissões no seu navegador e tente novamente.");
      }
    };

    getCameraStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = useCallback(() => {
    if (videoRef.current && canvasRef.current && !isLoading) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        canvas.toBlob(blob => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            onPhotoCaptured(file);
          }
        }, 'image/jpeg', 0.95);
      }
    }
  }, [videoRef, canvasRef, onPhotoCaptured, isLoading]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
        onCanPlay={() => setIsLoading(false)}
        onPlay={() => setIsLoading(false)}
      />
      <canvas ref={canvasRef} className="hidden"></canvas>
      
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center text-white">
          <SpinnerIcon />
          <p className="mt-2">Iniciando câmera...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center text-white p-4 text-center">
          <p className="mb-4">{error}</p>
          <button onClick={onClose} className="bg-gray-700 text-white font-bold py-2 px-4 rounded-full">
            Fechar
          </button>
        </div>
      )}

      {/* Controls Overlay */}
      <div className="absolute top-4 left-4">
        <button onClick={onClose} className="text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors">
          <CloseIcon />
        </button>
      </div>

      <div className="absolute bottom-6 left-0 right-0 p-4 flex justify-center">
        <button
          onClick={handleCapture}
          disabled={isLoading || !!error}
          className="w-20 h-20 rounded-full flex items-center justify-center p-1 border-4 border-white bg-white/30 disabled:opacity-50 hover:bg-white/50 transition-colors"
          aria-label="Capturar foto"
        >
            <div className="w-full h-full rounded-full bg-white"></div>
        </button>
      </div>
    </div>
  );
};
