'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link";
import { useForm } from "react-hook-form";
import { ControllerRenderProps } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/services/auth";
import { loginSchema, LoginData } from "@/schemas/login";
import { useRouter } from "next/navigation";
import { Card, CardContent, } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LogoCurrentColor } from "@/assets/icons/LogoCurrentColor";

export default function Login() {
    const router = useRouter()

    const form = useForm<LoginData>({ // Configurações do react-hook-form
        mode: "onBlur",
        resolver: zodResolver(loginSchema), // Usar a validação de campos do zod
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const { handleSubmit, setError, formState: { isSubmitting, errors } } = form

    const onSubmit = async (data: LoginData) => {
        const response = await login(data) // a sessão é gravada no servidor

        if (response.success) {
            router.replace('/app') // replace: "voltar" não retorna para o login
        } else {
            // 401 da API = e-mail ou senha inválidos (mensagem vem pronta)
            setError("root", { message: response.message })
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full max-w-100 select-none">
            <Card className="w-full p-4">
                <div className="flex flex-col items-center">
                    <LogoCurrentColor className="w-10  text-slate-600" />
                    <h1 className="mt-4 text-xl font-bold text-slate-700">Entrar na conta</h1>
                    <p className="text-chart-2">Acesse a plataforma Ponskan</p>
                </div>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }: { field: ControllerRenderProps<LoginData, "email"> }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            {/* O 'field' aqui já contém value, onChange, onBlur e ref */}
                                            <Input
                                                placeholder="seu@email.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }: { field: ControllerRenderProps<LoginData, "password"> }) => (
                                    <FormItem>
                                        <FormLabel>Senha</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {errors.root && <p className="text-sm text-destructive text-center">{errors.root.message}</p>}

                            <div className="flex flex-col gap-4">
                                <Button
                                    type="submit"
                                    className="w-full bg-amber-500 hover:bg-amber-600"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Acessando..." : "Entrar"}
                                </Button>

                                <div className="text-center text-sm text-muted-foreground space-y-2">
                                    <p className="text-center text-chart-2 mt-4">
                                        Não possui uma conta? <Link href="/signup" className="hover:underline hover:text-chart-4 transition-colors font-semibold">Cadastre-se</Link>
                                    </p>

                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Termos   */}
            <div className="flex px-4 pt-4 font-inter text-sm text-slate-500 text-center">
                <p>Ao prosseguir você concorda com os <Link className="font-semibold hover:underline" href="/termos">Termos de uso</Link> e as <Link className="font-semibold hover:underline" href="/policies">Políticas de privacidade</Link> </p>
            </div>
        </div>
    )
}