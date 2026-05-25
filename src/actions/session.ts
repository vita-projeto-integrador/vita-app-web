'use server'

import { cookies } from "next/headers"

interface SessionProps {
  token: string,
  userId: string,
  name: string,
  email: string
}

export const saveSession = async ({token, userId, name, email} : SessionProps) => {
  if(!token || token === "undefined" || token === "null") return // Verifica se o token passado é válido
  
  const cookieStore = await cookies()
  const fullToken = `Bearer ${token}`

  try{
    // Salvar o token em um Cookie protegido
    cookieStore.set('tokenPonskan', fullToken, {
      path: '/', // Todas as páginas do site o navegador tem permissão para enviar cookie
      httpOnly: true, // Impede que o JavaScript do cliente acesse o token (proteção XSS)
      secure: false, // process.env.NODE_ENV === 'production', // Só envia via HTTPS em produção
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 1, // Tempo de vida 1 dia
    })

    // 2. Salva os dados do usuário em um token acessivel para o front-end
    const userData = JSON.stringify({ userId, name, email })
    
    cookieStore.set('userPonskan', userData, {
      path: '/',
      httpOnly: false, // frontend pode ler leia para exibir na tela
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 1, // Tempo de vida 1 dia
    })

    return true
  } 
  catch(error) {
    console.log(error)
    return false
  }

}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('tokenPonskan') // Destruir cookie
}