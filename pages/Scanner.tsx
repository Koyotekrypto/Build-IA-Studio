import React, { useState, useRef } from 'react';
import { CameraIcon, UploadIcon } from '../components/icons/Icons';
import { CameraView } from '../components/CameraView';

interface ScannerProps {
  onFileSelect: (file: File) => void;
  onPhotoCaptured: (file: File) => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onFileSelect, onPhotoCaptured }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoCapturedAndClose = (file: File) => {
    setIsCameraOpen(false);
    onPhotoCaptured(file);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto text-center">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">Scanner de Recibos</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Use a câmera para escanear um recibo ou carregue um arquivo para extrair as informações da transação automaticamente com nossa IA.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scan with Camera */}
        <button
          onClick={() => setIsCameraOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-8 px-6 rounded-lg flex flex-col items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105 shadow-lg"
          aria-label="Escanear com a câmera"
        >
          <CameraIcon className="w-16 h-16 mb-4" />
          <span className="text-xl">Escanear com a Câmera</span>
        </button>

        {/* Upload File */}
        <button
          onClick={handleUploadClick}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-8 px-6 rounded-lg flex flex-col items-center justify-center transition-transform duration-200 ease-in-out hover:scale-105 shadow-lg"
          aria-label="Carregar arquivo"
        >
          <UploadIcon className="w-16 h-16 mb-4" />
          <span className="text-xl">Carregar Arquivo</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/png, image/jpeg, application/pdf"
        />
      </div>

      <div className="mt-12 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg text-left">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Instruções:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Para melhores resultados, posicione o recibo em uma superfície plana e bem iluminada.</li>
              <li>Certifique-se de que todo o texto esteja nítido e legível na foto.</li>
              <li>Após a captura ou upload, revise os dados extraídos antes de salvar a transação.</li>
          </ol>
      </div>

      {isCameraOpen && (
        <CameraView
          onClose={() => setIsCameraOpen(false)}
          onPhotoCaptured={handlePhotoCapturedAndClose}
        />
      )}
    </div>
  );
};