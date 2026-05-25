'use server'

import { api } from "./api";
import axios from "axios";
import { LoginData } from "@/schemas/login";
import { SignUpData } from "@/schemas/signUp"

// --------------------------------------------------
// FAZER LOGIN
// --------------------------------------------------
interface User {
    id: string,
    name: string,
    email: string
}

interface DataUser {
    token: string,
    user: User,
}

interface Success {
    success: true,
    message: string,
    data: DataUser,
}

interface Error {
    success: false,
    message: string,
    data: {},
}

export const loginUser = async (data: LoginData) : Promise<Success | Error> => {
    if(!data) return {
        success: false,
        message: "Erro com os dados de login",
        data: {}
    }

    try {
        const response = await api.post<Success>("/login", data)
        const res = response.data  // Encurtador

        return {
            success: true,
            message: res.message,
            data: res.data
        }
    } catch (error: unknown) {
        let message = "Erro ao carregar dados da API"
        if(axios.isAxiosError(error)) { // unknown para atender ao retorno esperado Promise<Analysis | AnalysisError>
            // Verifica se axios mandou error | Salva a mensagem personalizada que a API || Salva mensagem padrão do axios 
            message: error.response?.data.message || error.message
        }

        return {
            success: false,
            message: message,
            data: {}
        }
    }
}

// --------------------------------------------------
// CRIAR USUÁRIO
// --------------------------------------------------
export const createUser = async (data: SignUpData) : Promise<Success | Error> => {
    const { confirmPassword, isStudent, firstName, lastName, ...payload } = data // Filtrando os campos que serão enviados à API 

    const patternData = { // Unir nome e sobrenome para API
        ...payload,
        name: `${firstName} ${lastName}`,
        accessType: "produtor"
    }
    
    try {
        const response = await api.post('/user', patternData) // Mandar dados para validação
        const res = response.data  // Encurtador

        return {
            success: true,
            message: res.message,
            data: res.data
        }
    } catch (error: unknown) {
        let message = "Erro ao carregar dados da API"
        if(axios.isAxiosError(error)) { // unknown para atender ao retorno esperado Promise<Analysis | AnalysisError>
            // Verifica se axios mandou error | Salva a mensagem personalizada que a API || Salva mensagem padrão do axios 
            message: error.response?.data.message || error.message
        }

        return {
            success: false,
            message: message,
            data: {}
        }
    }
}