"use server"

import { api, } from "./api"
import axios from "axios"

interface ActionPlan {
    sumary: string
    recommendedActions: string
}

interface Image {
  path: string
}

interface Classification {
  class: 'true' | 'false'
  assurance: number
  timeExec: number
  modell_cnn: string
}

export interface DataAnalysis {
  id: string;
  status: 'finalizada' | 'pendente' | 'processando'
  createdAt: string
  images: Image[]
  classification: Classification
  actionPlan: ActionPlan | undefined
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

export const AnalysisDetails = async (idAnalyse : string) : Promise<AnalysisSuccess | AnalysisError> => {
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
      if(axios.isAxiosError(error)){ // unknown para atender ao retorno esperado Promise<Analysis | AnalysisError>
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