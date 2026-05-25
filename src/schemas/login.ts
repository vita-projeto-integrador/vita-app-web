import z from "zod";

export const loginSchema = z.object({
    email: z.email("Email inválido").min(1, "E-mail é obrigatório").max(100, "Email muito grande").trim(),
    password: z.string().min(1, "Senha invalida")
})

export type LoginData = z.infer<typeof loginSchema>