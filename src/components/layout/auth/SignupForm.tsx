'use client'

import { LogoCurrentColor } from "@/assets/icons/LogoCurrentColor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DateMask, PhoneMask } from "@/utils/masks"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema, SignUpData } from "@/schemas/signUp"
import { register } from "@/services/auth"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Step = {
    title: string,
    fields: (keyof SignUpData)[]
}

const FORM_STEPS: Step[] = [
    { title: "Insira seu nome", fields: ["firstName", "lastName"] },
    { title: "Contato", fields: ["email", "phone"] },
    { title: "Endereço e nascimento", fields: ["address", "birthDate"] },
    { title: "Dados empresariais", fields: ["cnpj"] },
    { title: "Você é um estudante?", fields: ["highSchool", "course"] },
    { title: "Defina sua senha", fields: ["password", "confirmPassword"] },
]

const maxRange = FORM_STEPS.length - 1

export const SignupForm = () => {
    const router = useRouter()
    const [stage, setStage] = useState(0)
    const [isSubmitting, setIsSubmiting] = useState(false)

    const form = useForm<SignUpData>({ // Configurações do react-hook-form
        shouldUnregister: false,
        resolver: zodResolver(signUpSchema),
        mode: "onSubmit", //  Só valida no clique do botão
        reValidateMode: "onChange",
        defaultValues: {
            firstName: "", lastName: "", email: "", phone: "",
            address: "", birthDate: "", cnpj: "",
            isStudent: false, highSchool: "", course: "",
            password: "", confirmPassword: ""
        }
    })

    const { handleSubmit, trigger, watch, setValue, clearErrors, setError } = form
    const isStudent = watch("isStudent")

    useEffect(() => {
        if (!isStudent) {
            setValue("highSchool", "")
            setValue("course", "")
            clearErrors(["highSchool", "course"])
        }
    }, [isStudent, setValue, clearErrors]);

    const increaseValue = async () => { // Aumentar contador de etapas
        const fields = FORM_STEPS[stage].fields // Pegar o name dos inputs da etapa atual do formulário
        const isValid = stage < maxRange && await trigger(fields) // Acionar o trigger (verificação) dos inputs atuais

        if (isValid) setStage((prev) => Math.min(prev + 1, maxRange)) // Acrescentar valor com verifiação se está no final do array
    }

    const decreaseValue = () => { // Aumentar contador de etapas
        setStage((prev) => Math.max(prev - 1, 0))
    }

    const onSubmit = async (data: SignUpData) => {
        setIsSubmiting(true)
        const response = await register(data) // a sessão é gravada no servidor

        if (response.success) {
            router.replace('/app')
            return
        }

        setIsSubmiting(false)
        const fields = Object.keys(response.fieldErrors) as (keyof SignUpData)[]

        if (fields.length === 0) { // erro geral (ex.: e-mail já cadastrado, API fora do ar)
            setError("root", { message: response.message })
            return
        }

        // erro por campo: marca os inputs e volta para a primeira etapa com erro
        fields.forEach((field) => setError(field, { message: response.fieldErrors[field] }))
        const firstStage = FORM_STEPS.findIndex((step) => step.fields.some((field) => fields.includes(field)))
        if (firstStage >= 0) setStage(firstStage)
    }

    return (
        <Card className="flex flex-1 p-6 w-full relative">
            <ProgressBar stage={stage + 1} range={maxRange + 1} />

            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col gap-4">
                    <div className="flex flex-col items-center">
                        <LogoCurrentColor className="w-10  text-slate-600" />
                        <h1 className="mt-4 text-xl font-bold text-slate-700">Crie uma conta Ponskan</h1>
                        <p className="text-chart-2">Insira seus dados para cadastrar</p>
                    </div>

                    <div className="flex flex-col gap-4 py-4 min-h-30">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={stage}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                            >
                                {/* STAGE 0: Nome */}
                                {stage === 0 && (
                                    <>
                                        <FormField control={form.control} name="firstName" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Primeiro nome</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="lastName" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Sobrenome</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </>
                                )}

                                {/* STAGE 1: Contato */}
                                {stage === 1 && (
                                    <>
                                        <FormField control={form.control} name="email" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="phone" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Telefone</FormLabel>
                                                <FormControl>
                                                    <Input {...field} onChange={(e) => {
                                                        e.target.value = PhoneMask(e.target.value)
                                                        field.onChange(e)
                                                    }} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </>
                                )}

                                {/* STAGE 2: Localização */}
                                {stage === 2 && (
                                    <>
                                        <FormField control={form.control} name="address" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Endereço</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="birthDate" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Data de nascimento</FormLabel>
                                                <FormControl>
                                                    <Input {...field} onChange={(e) => {
                                                        e.target.value = DateMask(e.target.value)
                                                        field.onChange(e)
                                                    }} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </>
                                )}

                                {/* STAGE 3: CNPJ */}
                                {stage === 3 && (
                                    <FormField control={form.control} name="cnpj" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CNPJ (opcional)</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                )}

                                {/* STAGE 4: Estudante */}
                                {stage === 4 && (
                                    <div className="space-y-4">
                                        <FormField control={form.control} name="isStudent" render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>Sou um estudante</FormLabel>
                                                </div>
                                            </FormItem>
                                        )} />
                                        {isStudent && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="space-y-4">
                                                <FormField control={form.control} name="highSchool" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Instituição</FormLabel>
                                                        <FormControl><Input {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name="course" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Curso</FormLabel>
                                                        <FormControl><Input {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                            </motion.div>
                                        )}
                                    </div>
                                )}

                                {/* STAGE 5: Senha */}
                                {stage === 5 && (
                                    <>
                                        <FormField control={form.control} name="password" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Senha</FormLabel>
                                                <FormControl><Input type="password" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirmar senha</FormLabel>
                                                <FormControl><Input type="password" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {form.formState.errors.root && (
                        <p className="text-sm text-destructive text-center">{form.formState.errors.root.message}</p>
                    )}

                    <div className="flex items-center justify-between mt-auto">
                        <Button type="button" onClick={decreaseValue} variant={stage > 0 ? "secondary" : "ghost"} disabled={stage === 0}>
                            Voltar
                        </Button>

                        {stage === maxRange ? (
                            <Button type="submit" disabled={isSubmitting} className="bg-amber-500 hover:bg-amber-600">
                                {isSubmitting ? "Enviando..." : "Criar conta"}
                            </Button>
                        ) : (
                            <Button type="button" onClick={increaseValue} className="bg-amber-500 hover:bg-amber-600">
                                Avançar
                            </Button>
                        )}
                    </div>

                    <p className="text-center text-chart-2 mt-4">
                        Já possui uma conta? <Link href="/login" className="hover:underline hover:text-chart-4 transition-colors font-semibold">Faça login</Link>
                    </p>
                </form>
            </Form>
        </Card>
    )
}