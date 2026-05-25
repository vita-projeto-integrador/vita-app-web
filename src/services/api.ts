'use server'

import axios from "axios"
import { cookies } from "next/headers"

const baseURL = 'http://localhost:8080'

export const api = axios.create({
    baseURL: baseURL,
    withCredentials: true // Navegador anexa os cookies automaticamente nas requisições 
})

api.interceptors.request.use((async config => {
    const cookieStore = await cookies()
    const token = cookieStore.get("tokenPonskan")

    config.headers.Authorization = token?.value

    return config
}))