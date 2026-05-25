"use server"

import { api, } from "./api"
import axios from "axios"

interface Analysis {
  id: string
  id_usuario: string
  status: 'finalizada' | 'pendente' | 'processando'
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

interface AnalysisImage {
  id: string
  id_analise: string
  nome: string
  caminho: string
  coordenadas: string | null
  tipo_mime: string
  tamanho: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

interface AnalysisClassification {
  id: string;
  id_analise: string
  tempo_execucao: number
  classe: 'true' | 'false'
  confianca: number
  modelo_cnn: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface AnalysisReportData {
  analysis: Analysis
  images: AnalysisImage[]
  classification: AnalysisClassification[]
}

export interface AnalysisSuccess {
  success: true
  message: string
  data: AnalysisReportData
}

export interface AnalysisError {
    success: false
    message: string
    data: {}
}

export const getOneAnalysis = async (idAnalyse : string) : Promise<AnalysisSuccess | AnalysisError> => {
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