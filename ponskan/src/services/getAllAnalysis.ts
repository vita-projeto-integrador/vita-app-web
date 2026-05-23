'use server'

import axios from "axios"
import { api } from "./api"

type StatusAnalysis = "finalizada" | "pendente" | "cancelada" // Status da análise

interface AnalysisData { // Dados individuaids de cada análise
    id: string
    status: StatusAnalysis
    createdAt: string
    imagesCount: number
    classificacao: {
        id: string
        classe: string
        confianca: number
        tempo_execucao: number
        createdAt: string
    }
}

interface Analysis { // Padrão de resposta da API
    success: true
    message: string
    data: AnalysisData[]
}

interface AnalysisError { // Padrão de resposta de erro da API
    success: false
    message: string
    data: []
}

export const getAllAnalysis = async (page: number) : Promise<Analysis | AnalysisError>=> {
    if (page < 1 || !page) return { // Retorno em caso de problema com número de pagina
            success: false,
            message: "Página inválida",
            data: []
        } 

    try {
        const response = await api.get<Analysis>("analysis", {
            params: { page: page }
        })
        const res = response.data // Encurtando o caminho

        return {
            success: true,
            message: res.message,
            data: res?.data || []
        }
    } catch (error: unknown) { // unknown para atender ao retorno esperado Promise<Analysis | AnalysisError>
        let message = "Erro inesperado na requisição"

        if (axios.isAxiosError(error)) { // Verifica se error é veio do axios
            // Caso positivo pega a resposta customizada da API e sobreescreve apiMessage
            // Se requisição não conseguir retornar com a resposta devolve o erro de conexão do axios 
            message = error.response?.data.message || error.message 
        }

        return {
            success: false,
            message: message,
            data: []
        }
    }
}