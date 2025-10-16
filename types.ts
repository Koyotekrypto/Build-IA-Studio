export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
}

export interface ExtractedData {
    estabelecimento?: string;
    data?: string; // YYYY-MM-DD
    valor?: number;
    descricao?: string;
}