import "server-only" // erro de build se um componente do navegador importar este arquivo

import axios from "axios"
import { cookies } from "next/headers"
import { TOKEN_COOKIE } from "@/lib/session"

const baseURL = process.env.API_URL
if (!baseURL) throw new Error("API_URL não definida no .env")

export const api = axios.create({
    baseURL, // ex.: http://localhost:8080/api
    timeout: 15_000, // upload de 4 imagens de 5 MB cabe com folga
})

// Anexa o token guardado no cookie httpOnly em toda chamada
api.interceptors.request.use(async (config) => {
    const token = (await cookies()).get(TOKEN_COOKIE)?.value
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})