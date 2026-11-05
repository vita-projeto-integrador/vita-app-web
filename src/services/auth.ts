"use server"

import { request } from "./request"
import { saveSession } from "./session"
import type { LoginData } from "@/schemas/login"
import type { SignUpData } from "@/schemas/signUp"
import type { ApiFieldError, AuthData } from "@/types/api"
import type { SessionUser } from "@/lib/session"

// Resultado para as telas de login/cadastro: o token nunca chega ao navegador
export type AuthResult =
    | { success: true; user: SessionUser }
    | { success: false; message: string; fieldErrors: Partial<Record<keyof SignUpData, string>> }

// Campos da API -> campos do formulário (para exibir o erro no input certo)
const FIELD_MAP: Record<string, keyof SignUpData> = {
    nome: "firstName",
    email: "email",
    senha: "password",
    telefone: "phone",
    endereco: "address",
    data_nascimento: "birthDate",
    cnpj: "cnpj",
    faculdade: "highSchool",
    curso: "course",
}

function toFieldErrors(errors: ApiFieldError[]) {
    const result: Partial<Record<keyof SignUpData, string>> = {}
    for (const { field, message } of errors) {
        const formField = field ? FIELD_MAP[field] : undefined
        if (formField && !result[formField]) result[formField] = message
    }
    return result
}

// Grava a sessão no servidor e devolve só os dados públicos do usuário
async function startSession({ usuario, token }: AuthData): Promise<AuthResult> {
    const user: SessionUser = { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil }
    const saved = await saveSession(token, user)
    if (!saved) return { success: false, message: "Sessão inválida recebida da API", fieldErrors: {} }
    return { success: true, user }
}

export async function login(data: LoginData): Promise<AuthResult> {
    const response = await request<AuthData>(
        { method: "POST", url: "/user/login", data: { email: data.email, senha: data.password } },
        { public: true }
    )
    if (!response.success) return { success: false, message: response.message, fieldErrors: toFieldErrors(response.errors) }
    return startSession(response.data)
}

export async function register(data: SignUpData): Promise<AuthResult> {
    // formulário -> contrato da API (campos vazios vão como undefined e a API grava null)
    const payload = {
        nome: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        senha: data.password,
        perfil: data.isStudent ? "estudante" : "produtor",
        telefone: data.phone || undefined,
        endereco: data.address || undefined,
        data_nascimento: data.birthDate || undefined, // já em AAAA-MM-DD (schema do formulário)
        cnpj: data.cnpj || undefined,
        faculdade: data.isStudent ? data.highSchool || undefined : undefined,
        curso: data.isStudent ? data.course || undefined : undefined,
    }

    const response = await request<AuthData>({ method: "POST", url: "/user/register", data: payload }, { public: true })
    if (!response.success) return { success: false, message: response.message, fieldErrors: toFieldErrors(response.errors) }
    return startSession(response.data)
}