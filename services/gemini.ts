
import { GoogleGenAI, Type } from "@google/genai";
import { Evaluation } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY || "" });

export const getPerformanceInsights = async (evaluations: Evaluation[]) => {
  const prompt = `Analise os seguintes dados de avaliação de desempenho de um pool de talentos temporários e forneça 3 insights estratégicos curtos (máximo 2 frases cada) sobre tendências de desempenho e áreas de melhoria.
  
  Dados: ${JSON.stringify(evaluations)}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "Você é um especialista sênior em RH e gestão de talentos públicos. Forneça insights executivos em português. Não mencione o nome de modelos de IA como 'Gemini' em suas respostas.",
        temperature: 0.7,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Erro ao obter insights da IA:", error);
    return "Não foi possível gerar insights no momento. Verifique sua conexão ou tente novamente mais tarde.";
  }
};
