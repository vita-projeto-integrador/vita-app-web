// Lê o "exp" do JWT sem verificar a assinatura: serve para decidir redirecionamentos
// e a validade do cookie. Quem verifica o token de verdade é a API.

export function getTokenExpiry(token: string): number | null {
    try {
        const payload = token.split(".")[1]
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/")
        const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")
        const { exp } = JSON.parse(atob(padded))
        return typeof exp === "number" ? exp : null // segundos (unix)
    } catch {
        return null
    }
}

export function isTokenAlive(token: string): boolean {
    const exp = getTokenExpiry(token)
    return exp !== null && exp * 1000 > Date.now()
}