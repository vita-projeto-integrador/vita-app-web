import "server-only"

import axios, { type AxiosRequestConfig } from "axios"
import { redirect } from "next/navigation"
import { api } from "./api"
import { clearSession } from "./session"
import type { ApiErrorBody, ApiResult, ApiSuccessBody } from "@/types/api"

interface RequestOptions {
    public?: boolean // login/cadastro: 401 é "credencial errada", não "sessão vencida"
}

// Único ponto que fala com a API: converte sucesso e erro num ApiResult
export async function request<T>(config: AxiosRequestConfig, options: RequestOptions = {}): Promise<ApiResult<T>> {
    try {
        const response = await api.request<ApiSuccessBody<T>>(config)
        return { success: true, message: response.data.message, data: response.data.data }
    } catch (error) {
        if (!axios.isAxiosError<ApiErrorBody>(error)) {
            return { success: false, status: null, message: "Erro inesperado", errors: [] }
        }

        const status = error.response?.status ?? null

        // token vencido ou usuário removido: sai do try para o redirect não ser capturado
        if (status === 401 && !options.public) return expireSession()

        return {
            success: false,
            status,
            message: error.response?.data?.message ?? connectionMessage(error.code),
            errors: error.response?.data?.errors ?? [],
        }
    }
}

async function expireSession(): Promise<never> {
    await clearSession()
    redirect("/login")
}

function connectionMessage(code?: string) {
    return code === "ECONNABORTED" ? "A API demorou para responder" : "Não foi possível conectar à API"
}