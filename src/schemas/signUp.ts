import { z } from "zod";

// Validação dos campos do formulario
export const signUpSchema = z.object({
    firstName: z.string().min(1, "Nome é obrigatório").max(50, "Nome muito grande").refine(val => !/[^a-zA-ZÀ-ÿ\s]/.test(val), "Contem caracteres proibidos").trim(),
    lastName: z.string().min(1, "Sobrenome é obrigatório").max(50, "Nome muito grande").refine(val => !/[^a-zA-ZÀ-ÿ\s]/.test(val), "Contem caracteres proibidos").trim(),

    birthDate: z.string()
        .min(1, "Data de nascimento é obrigatória")
        .refine(val => /^\d{2}\/\d{2}\/\d{4}$/.test(val), "Formato Inválido")
        .transform(val => {
            const [dia, mes, ano] = val.split("/");
            return `${ano}-${mes}-${dia}`; // Converte para formato ISO (AAAA-MM-DD)
        })
        .pipe(
            z.string().refine(val => {
                const date = new Date(val);
                // Verifica se é uma data válida e se não é no futuro
                return !isNaN(date.getTime()) && date <= new Date();
            }, "Data inválida ou no futuro")
        ),

    email: z.email("Email inválido").min(1, "E-mail é obrigatório").max(100, "Email muito grande").trim(),

    address: z.string().min(1, "Endereço é obrigatório").max(255, "Endereço muito grande").refine(val => !/[^a-zA-ZÀ-ÿ0-9\s]/.test(val), "Contem caracteres proibidos").trim(),

    phone: z.string()
        .min(1, "Telefone é obrigatório")
        .transform((val) => val.replace(/[^\d]/g, ""))
        .pipe(
            z.string()
                .min(10, "Mínimo 10 dígitos")
                .max(11, "Máximo 11 dígitos")
        ),

    // CNPJ: se for vazio aceita, se tiver algo tem que ter 14
    cnpj: z.string()
        .transform((val) => val.replace(/[^\d]/g, ""))
        .refine((val) => val.length === 0 || val.length === 14, "CNPJ deve ter 14 dígitos"),

    isStudent: z.boolean(),
    highSchool: z.string().max(100, "Nome da escola é muito grande").refine(val => !/[^a-zA-ZÀ-ÿ\s]/.test(val), "Contem caracteres proibidos").trim().or(z.literal("")),
    course: z.string().max(100, "Nome do curso é muito grande").refine(val => !/[^a-zA-ZÀ-ÿ\s]/.test(val), "Contem caracteres proibidos").trim().or(z.literal("")),

    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres")
        .refine((val) => /[A-Z]/.test(val), "Deve conter ao menos uma letra maiúscula")
        .refine((val) => /[0-9]/.test(val), "Deve conter ao menos um número")
        .refine((val) => /[^a-zA-Z0-9]/.test(val), "Deve conter ao menos um caractere especial"),

    confirmPassword: z.string().min(6, "Confirmação é obrigatória").trim()

}).refine((data) => data.password === data.confirmPassword, { // Validar igualdade de senha (front-end)
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
})

// Type do objeto z que define os campos
export type SignUpData = z.infer<typeof signUpSchema>

