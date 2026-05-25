import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // No proxy, pegamos o cookie direto do objeto da requisição
  const token = request.cookies.get('tokenPonskan')?.value


  if (!token) {
    // Se não tem o token manda pra login
    // Puxa a url negada (www.site.com/dashboard) e troca a ultima parte por /login --> redireciona
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// O matcher define onde o proxy deve atuar
export const config = {
  matcher: ['/app/:path*']
}