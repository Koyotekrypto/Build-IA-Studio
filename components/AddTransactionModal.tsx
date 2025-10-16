import React, { useState, useCallback, useEffect, useRef } from 'react';
import { type Transaction, type TransactionType, type ExtractedData } from '../types';
import { CATEGORIES } from '../constants';
import { UploadIcon, SpinnerIcon, CloseIcon, AISparkleIcon } from './icons/Icons';

interface AddTransactionModalProps {
  onClose: () => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onUpdateTransaction: (transaction: Transaction) => void;
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  initialData?: ExtractedData;
  initialType?: TransactionType;
  error?: string | null;
  transactionToEdit?: Transaction | null;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ 
    onClose, 
    onAddTransaction,
    onUpdateTransaction,
    onFileSelect,
    isProcessing,
    initialData,
    initialType = 'expense',
    error: processingError,
    transactionToEdit
}) => {
  const isEditMode = !!transactionToEdit;
  const [type, setType] = useState<TransactionType>(initialType);
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [fileName, setFileName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFileName(selectedFile.name);
      onFileSelect(selectedFile);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      setType(transactionToEdit.type);
      setAmount(transactionToEdit.amount.toString());
      setDate(transactionToEdit.date);
      setDescription(transactionToEdit.description);
      setCategory(transactionToEdit.category);
    } else {
        setType(initialType);
    }
  }, [transactionToEdit, isEditMode, initialType]);

  useEffect(() => {
      if(initialData && !isEditMode) {
        if (initialData.valor) setAmount(initialData.valor.toString());
        if (initialData.data) setDate(initialData.data);
        const desc = initialData.descricao || initialData.estabelecimento || '';
        if (desc) setDescription(desc);
        setType('expense');
      }
  }, [initialData, isEditMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!amount || !description || !category || !date) {
      setFormError("Por favor, preencha todos os campos.");
      return;
    }

    const transactionData = {
        type,
        amount: parseFloat(amount),
        date,
        description,
        category,
    };

    if (isEditMode) {
        onUpdateTransaction({ ...transactionData, id: transactionToEdit.id });
    } else {
        onAddTransaction(transactionData);
    }

    onClose();
  };
  
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <CloseIcon />
          </button>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            {isEditMode ? 'Editar Transação' : 'Adicionar Transação'}
          </h2>

          {!isEditMode && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Enviar nota fiscal com IA</label>
                <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadIcon />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Clique para enviar</span> ou arraste e solte</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, ou PDF</p>
                    </div>
                    <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, application/pdf"/>
                </label>
                {fileName && !isProcessing && <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Arquivo: {fileName}</p>}
              </div>

              {isProcessing && (
                <div className="flex items-center justify-center p-4 my-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                  <SpinnerIcon />
                  <p className="ml-3 text-blue-800 dark:text-blue-200">Analisando documento com IA...</p>
                </div>
              )}
            </>
          )}

          {processingError && <p className="text-red-500 text-sm mb-4">{processingError}</p>}
          {formError && <p className="text-red-500 text-sm mb-4">{formError}</p>}
          
           {!isEditMode && (
             <div className="flex items-center gap-2 mb-4">
                <AISparkleIcon />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {(fileName || initialData) ? 'Revise os dados extraídos' : 'Ou adicione manually'}
                </h3>
             </div>
           )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex space-x-4">
                <button type="button" onClick={() => setType('income')} className={`w-full py-2 rounded-md ${type === 'income' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>Receita</button>
                <button type="button" onClick={() => setType('expense')} className={`w-full py-2 rounded-md ${type === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>Despesa</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Valor</label>
                <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} step="0.01" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data</label>
                <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição</label>
              <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoria</label>
              <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={onClose} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 dark:border-gray-500">Cancelar</button>
              <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                {isEditMode ? 'Salvar Alterações' : 'Salvar Transação'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};