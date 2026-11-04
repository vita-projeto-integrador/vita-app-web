'use server'

import axios from "axios"
import { api } from "./api"

// Valores do contrato do mapa (iguais aos da API TS)
export type MapStatus = "em_espera" | "processando" | "finalizada" | "falhou"
export type MapClasse = "saudavel" | "infectado"

export interface AnalysisMapItem {
    id: string
    status: MapStatus
    classe: MapClasse | null // null enquanto não termina ou se falhou
    confianca: number | null
    createdAt: string
    latitude: number
    longitude: number
    precisao: number // raio de erro do GPS, em metros
}

export interface MapFilters {
    from?: string
    to?: string
    status?: string // ex.: "em_espera,processando"
    classe?: MapClasse
}

interface MapData {
    items: AnalysisMapItem[]
    total: number
    page: number
    limit: number
}

interface MapSuccess {
    success: true
    message: string
    data: MapData
}

interface MapError {
    success: false
    message: string
    data: MapData
}

export const getMapAnalyses = async (filters: MapFilters): Promise<MapSuccess | MapError> => {
    try {
        // Filtros vazios (undefined) não vão na URL
        const response = await api.get<MapSuccess>("/analysis/map", { params: filters })
        const res = response.data // Encurtador

        return {
            success: true,
            message: res.message,
            data: res.data
        }
    } catch (error: unknown) {
        let message = "Erro ao carregar o mapa"
        if (axios.isAxiosError(error)) { // Mensagem da API || mensagem padrão do axios
            message = error.response?.data.message || error.message
        }

        return {
            success: false,
            message: message,
            data: { items: [], total: 0, page: 1, limit: 0 }
        }
    }
}