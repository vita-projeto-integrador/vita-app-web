// Nomes e formato dos cookies de sessão (usado no servidor e no navegador)

export const TOKEN_COOKIE = "vita_token" // JWT puro, httpOnly
export const USER_COOKIE = "vita_user" // dados públicos para a interface

// Dados do usuário que a interface pode ler (nunca o token)
export interface SessionUser {
    id: string
    nome: string
    email: string
    perfil: string
}