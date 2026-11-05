"use server"

import { redirect } from "next/navigation"
import { clearSession } from "@/services/session"

// Única ação de sessão exposta ao navegador: gravar sessão só acontece no servidor
export async function logout() {
    await clearSession()
    redirect("/login")
}