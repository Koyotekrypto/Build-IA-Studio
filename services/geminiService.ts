import { GoogleGenAI, Type } from '@google/genai';
import { type ExtractedData } from '../types';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const extractTransactionDataFromFile = async (file: File): Promise<ExtractedData> => {
    if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not set.");
        // Return mock data for development if API key is not available
        return new Promise(resolve => setTimeout(() => resolve({
            estabelecimento: "Supermercado Exemplo",
            data: new Date().toISOString().split('T')[0],
            valor: 123.45,
            descricao: "Compra de teste do mock"
        }), 1500));
    }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const imagePart = await fileToGenerativePart(file);
  const prompt = "Analise a imagem deste recibo ou nota fiscal e extraia as seguintes informações: o nome do estabelecimento, a data da transação (no formato AAAA-MM-DD), o valor total, e uma breve descrição dos itens principais, se disponível. O valor deve ser um número, sem símbolos de moeda.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            estabelecimento: { type: Type.STRING, description: 'Nome do estabelecimento comercial.' },
            data: { type: Type.STRING, description: 'Data da transação no formato AAAA-MM-DD.' },
            valor: { type: Type.NUMBER, description: 'Valor total da transação.' },
            descricao: { type: Type.STRING, description: 'Breve descrição da compra ou dos itens.' },
          },
        },
      },
    });

    const jsonString = response.text.trim();
    const parsedData = JSON.parse(jsonString);
    
    // Combine estabelecimento and descricao for a better user experience
    if (parsedData.estabelecimento && !parsedData.descricao) {
        parsedData.descricao = parsedData.estabelecimento;
    } else if (!parsedData.estabelecimento && parsedData.descricao) {
        parsedData.estabelecimento = parsedData.descricao;
    }

    return parsedData as ExtractedData;

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Falha ao extrair dados do arquivo. Tente novamente.');
  }
};