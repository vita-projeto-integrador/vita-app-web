import { z } from "zod";

// Mesmas regras da API, com mensagens para o formulário
// (nomes dos campos são do formulário; services/auth.ts traduz para o contrato)

const onlyLetters = (val: string) => !/[^a-zA-ZÀ-ÿ\s]/.test(val)

export const signUpSchema = z.object({
    firstName: z.string().trim().min(1, "Nome é obrigatório").max(50, "Nome muito grande").refine(onlyLetters, "Use apenas letras"),
    lastName: z.string().trim().min(1, "Sobrenome é obrigatório").max(50, "Sobrenome muito grande").refine(onlyLetters, "Use apenas letras"),

    // digitado como DD/MM/AAAA (máscara) e enviado como AAAA-MM-DD (contrato da API)
    birthDate: z.string()
        .min(1, "Data de nascimento é obrigatória")
        .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Use o formato DD/MM/AAAA")
        .transform(val => {
            const [dia, mes, ano] = val.split("/");
            return `${ano}-${mes}-${dia}`;
        })
        .pipe(
            z.iso.date("Data inválida").refine(val => new Date(val) <= new Date(), "Data no futuro")
        ),

    email: z.string().trim().min(1, "E-mail é obrigatório").max(100, "E-mail muito grande").pipe(z.email("E-mail inválido")),

    // a API aceita qualquer caractere: "Rua X, 123 - Centro" é um endereço válido
    address: z.string().trim().min(1, "Endereço é obrigatório").max(255, "Endereço muito grande"),

    phone: z.string()
        .min(1, "Telefone é obrigatório")
        .transform((val) => val.replace(/[^\d]/g, ""))
        .pipe(
            z.string()
                .min(10, "Mínimo 10 dígitos")
                .max(11, "Máximo 11 dígitos")
        ),

    // CNPJ: vazio é aceito; preenchido precisa de 14 dígitos
    cnpj: z.string()
        .transform((val) => val.replace(/[^\d]/g, ""))
        .refine((val) => val.length === 0 || val.length === 14, "CNPJ deve ter 14 dígitos"),

    isStudent: z.boolean(),
    highSchool: z.string().trim().max(100, "Nome da instituição muito grande"),
    course: z.string().trim().max(100, "Nome do curso muito grande"),

    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres")
        .refine((val) => new TextEncoder().encode(val).length <= 72, "Senha muito grande")
        .refine((val) => /[A-Z]/.test(val), "Deve conter ao menos uma letra maiúscula")
        .refine((val) => /[a-z]/.test(val), "Deve conter ao menos uma letra minúscula")
        .refine((val) => /[0-9]/.test(val), "Deve conter ao menos um número")
        .refine((val) => /[^a-zA-Z0-9]/.test(val), "Deve conter ao menos um caractere especial"),

    confirmPassword: z.string().min(1, "Confirmação é obrigatória"),

}).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
        ctx.addIssue({ code: "custom", path: ["confirmPassword"], message: "As senhas não coincidem" })
    }
    // estudante: a API exige ao menos 3 caracteres na instituição
    if (data.isStudent && data.highSchool.length < 3) {
        ctx.addIssue({ code: "custom", path: ["highSchool"], message: "Informe a instituição (mínimo 3 caracteres)" })
    }
})

export type SignUpData = z.infer<typeof signUpSchema>