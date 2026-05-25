'use server'

import { api } from "./api"
import axios from "axios"

interface UploadImageData {
    id: string
    status: string
    id_usuario: string
    updateAt: string
    createdAt: string
}

interface UploadImage {
    success: true
    status: number
    message: string
    data: UploadImageData
} 

interface UploadImageError {
    success: false
    status: number
    message: string
    data: {}
}

export const uploapImagesForAnalyse = async (files: FormData) : Promise<UploadImage | UploadImageError> => {
    if (!files) return { // Retorno ao ter problema com idAnalyse
        success: false,
        status: 400,
        message: "Sem imagens",
        data: {}
    }

    try {
        const response = await api.post<UploadImage>("/analysis", files, {
            headers: { "Content-Type": "multipart/form-data", }
        })
        const res = response.data  // Encurtador

        return {
            success: true,
            status: 201,
            message: res?.message,
            data: res?.data || {}
        }
    } catch(error: unknown) { // unknown para atender ao retorno esperado Promise<Analysis | AnalysisError>
        let messageApi = "Erro ao fazer upload"
        if(axios.isAxiosError(error)) { // Verifica se error é veio do axios
            // Verifica se axios mandou error | Salva a mensagem personalizada que a API || Salva mensagem padrão do axios 
            messageApi = error.response?.data.message || error.message
        }

        return {
            success: false,
            message: messageApi,
            status: 400,
            data: {}
        }
    }
}
