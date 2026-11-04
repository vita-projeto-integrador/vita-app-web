"use server"

import { api, } from "./api"
import axios from "axios"

interface ActionPlan {
  sumary: string
  recommendedActions: string
}

interface Image {
  caminho: string
}

interface Classification {
  classe: '1' | '0'
  confianca: number
  tempo_execucao: number
  modelo_cnn: string
}

export interface DataAnalysis {
  id: string;
  status: 'finalizada' | 'pendente' | 'processando'
  createdAt: string
  imagem: Image[]
  classificacao: Classification
  actionPlan: ActionPlan | undefined // Não desenvolvido
  localizacao: { latitude: number; longitude: number; precisao: number } | null // null sem GPS
}

interface AnalysisSuccess {
  success: true
  message: string
  data: DataAnalysis
}

interface AnalysisError {
  success: false
  message: string
  data: {}
}

export const AnalysisDetails = async (idAnalyse: string): Promise<AnalysisSuccess | AnalysisError> => {
  if (!idAnalyse) return {  // Retorno ao ter problema com idAnalyse
    success: false,
    message: "Id da análise não encontrado",
    data: {}
  }

  try {
    const response = await api.get<AnalysisSuccess>(`/analysis/${idAnalyse}`) // Get na API
    const res = response.data // Encurtador

    return {
      success: true,
      message: res.message,
      data: res.data
    }
  } catch (error: unknown) {
    let message = "Erro ao se comunicar com a API"
    if (axios.isAxiosError(error)) { // unknown para atender ao retorno esperado Promise<Analysis | AnalysisError>
      // Verifica se axios mandou error | Salva a mensagem personalizada que a API || Salva mensagem padrão do axios 
      message = error.response?.data.message || error.message
    }

    return {
      success: false,
      message: message,
      data: {}
    }
  }
}