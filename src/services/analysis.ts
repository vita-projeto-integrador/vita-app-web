"use server"

import { request } from "./request"
import type {
    AnalysisDetails,
    AnalysisListItem,
    AnalysisMapItem,
    ApiResult,
    CreatedAnalysis,
    MapFilters,
    Paginated,
} from "@/types/api"

// Lista paginada (page começa em 1, como na API)
export async function listAnalyses(page: number, limit = 20): Promise<ApiResult<Paginated<AnalysisListItem>>> {
    return request({ method: "GET", url: "/analysis", params: { page, limit } })
}

export async function getAnalysis(id: string): Promise<ApiResult<AnalysisDetails>> {
    return request({ method: "GET", url: `/analysis/${id}` })
}

// FormData com o campo "images" (1 a 4 arquivos); o axios monta o boundary do multipart
export async function createAnalysis(files: FormData): Promise<ApiResult<CreatedAnalysis>> {
    return request({ method: "POST", url: "/analysis", data: files, timeout: 60_000 }) // até 20 MB
}

// Filtros vazios (undefined) não vão na URL
export async function getMapAnalyses(filters: MapFilters): Promise<ApiResult<Paginated<AnalysisMapItem>>> {
    return request({ method: "GET", url: "/analysis/map", params: filters })
}