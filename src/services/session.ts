import "server-only"

import { cookies } from "next/headers"
import { getTokenExpiry } from "@/lib/jwt"
import { TOKEN_COOKIE, USER_COOKIE, type SessionUser } from "@/lib/session"

// Grava a sessão com a mesma validade do JWT (o cookie não sobrevive ao token)
export async function saveSession(token: string, user: SessionUser): Promise<boolean> {
    const exp = getTokenExpiry(token)
    const maxAge = exp ? exp - Math.floor(Date.now() / 1000) : 0
    if (maxAge <= 0) return false

    const cookieStore = await cookies()
    const secure = process.env.NODE_ENV === "production"

    cookieStore.set(TOKEN_COOKIE, token, { path: "/", httpOnly: true, secure, sameSite: "strict", maxAge })
    cookieStore.set(USER_COOKIE, JSON.stringify(user), { path: "/", httpOnly: false, secure, sameSite: "strict", maxAge })
    return true
}

export async function clearSession() {
    const cookieStore = await cookies()
    cookieStore.delete(TOKEN_COOKIE)
    cookieStore.delete(USER_COOKIE)
}