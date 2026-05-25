import { SignupForm } from "@/components/layout/auth/SignupForm"
import Link from "next/link"

export default function Logon() {


    return (
        <div className="flex flex-col items-center min-h-115 h-fit w-full max-w-100 font-lexend select-none">
            {/* Formulário */}
            <SignupForm />

            {/* Termos   */}
            <div className="flex px-4 pt-4 font-inter text-sm text-slate-500 text-center">
                <p>Ao prosseguir você concorda com os <Link className="font-semibold hover:underline" href="/termos">Termos de uso</Link> e as <Link className="font-semibold hover:underline" href="/policies">Políticas de privacidade</Link> </p>
            </div>
        </div>
    )
}

