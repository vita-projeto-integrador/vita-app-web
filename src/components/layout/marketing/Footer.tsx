import Link from "next/link"
import { LogoCurrentColor } from "@/assets/icons/LogoCurrentColor"


export const Footer = () => {
    return (
        <>
        <footer className="flex font-lexend flex-col w-full max-w-300 mx-auto items-center py-8 gap-6 select-none">
            <ul className="flex gap-4 flex-wrap justify-center w-full pb-8  border-b border-slate-200">
                <li><Link href="" className="text-slate-600 whitespace-nowrap hover:text-amber-500 transition-colors">Políticas de privacidade</Link> </li>
                <li><Link href="" className="text-slate-600 whitespace-nowrap hover:text-amber-500 transition-colors">Termos de uso</Link> </li>
                <li><Link href="" className="text-slate-600 whitespace-nowrap hover:text-amber-500 transition-colors">Uso de cookies</Link> </li>
            </ul>

            <div className="flex w-full items-center px-4">
                <p className="text-slate-500">© 2026 Ponskan. Todos os direitos reservados.</p>
                <LogoCurrentColor className="ml-auto w-5 text-slate-700"/>
            </div>
        </footer>
        </>
    )
}