'use server'

import axios from "axios"
import { api } from "./api"

type StatusAnalysis = "finalizada" | "pendente" | "cancelada" // Status da análise

interface Classificacao {
    classe: string
    confianca: number
}

interface AnalysisData { // Dados individuaids de cada análise
    id: string
    status: StatusAnalysis
    createdAt: string
    imagesCount: number
    classificacao: Classificacao | undefined // undefined pois o processo de classificação é assincrono e inicia sem dados
}

export interface Success { // Padrão de resposta da API
    success: true
    message: string
    data: AnalysisData[]
}

export interface Error { // Padrão de resposta de erro da API
    success: false
    message: string
    data: []
}

export const getAllAnalysis = async (page: number): Promise<Success | Error> => {
    if (page < 1 || !page) return { // Retorno em caso de problema com número de pagina
        success: false,
        message: "Página inválida",
        data: []
    }

    try {
        const response = await api.get<Success>("analysis", {
            params: { page: page }
        })
        const res = response.data // Encurtando o caminho

        return {
            success: true,
            message: res.message,
            data: res?.data
        }
    } catch (error: unknown) { // unknown para atender ao retorno esperado Promise<Success | Error>
        let message = "Erro inesperado na requisição"

        if (axios.isAxiosError(error)) { // Verifica se error é veio do axios
            // Verifica se axios mandou error | Salva a mensagem personalizada que a API || Salva mensagem padrão do axios 
            message = error.response?.data.message || error.message
        }

        return {
            success: false,
            message: message,
            data: []
        }
    }
}