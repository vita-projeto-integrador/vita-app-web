import type { AnalysisStatus, ClassificationClass } from "@/types/api"

// Textos da interface para os valores da API (fonte única: tabela, folha de detalhes e mapa)

export const STATUS_LABEL: Record<AnalysisStatus, string> = {
    em_espera: "Na fila",
    processando: "Processando",
    finalizada: "Finalizada",
    falhou: "Falhou",
}

export const CLASSE_LABEL: Record<ClassificationClass, string> = {
    infectado: "Pinta preta detectada",
    saudavel: "Fruta saudável",
}

export const isInProgress = (status: AnalysisStatus) => status === "em_espera" || status === "processando"

// "2026-11-04T13:20:00.000Z" -> "04/11/2026" no fuso do navegador
export const formatDate = (iso: string) => new Date(iso).toLocaleDateString("pt-BR")

// 0.9312 -> "93,1%"
export const formatConfidence = (value: number, digits = 1) =>
    `${(value * 100).toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits })}%`

// Regras do upload (iguais às da API)
export const UPLOAD_RULES = {
    minImages: 1,
    maxImages: 4,
    maxBytes: 5 * 1024 * 1024,
    accept: ["image/jpeg", "image/png", "image/webp"],
}