import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { isTokenAlive } from "@/lib/jwt"
import { TOKEN_COOKIE, USER_COOKIE } from "@/lib/session"

// Checagem otimista: só olha o "exp" do token. A API continua validando a assinatura.
export function proxy(request: NextRequest) {
    const token = request.cookies.get(TOKEN_COOKIE)?.value
    const loggedIn = token ? isTokenAlive(token) : false
    const { pathname } = request.nextUrl

    if (pathname.startsWith("/app") && !loggedIn) {
        const response = NextResponse.redirect(new URL("/login", request.url))
        response.cookies.delete(TOKEN_COOKIE) // token vencido não fica no navegador
        response.cookies.delete(USER_COOKIE)
        return response
    }

    // quem já está logado não precisa ver login/cadastro
    if ((pathname === "/login" || pathname === "/signup") && loggedIn) {
        return NextResponse.redirect(new URL("/app", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/app/:path*", "/login", "/signup"],
}