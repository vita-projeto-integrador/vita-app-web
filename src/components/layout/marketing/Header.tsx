import { Logotipo } from "@/assets/icons/Logotipo"
import { Logo } from "@/assets/icons/Logo"
import Link from "next/link"

export const Header = () => {
    return (
        <>
        <nav className='flex font-lexend items-center w-full max-w-400 mx-auto pt-10 px-4 select-none z-100'>
            <Link href="/">
                <Logotipo className="hidden md:block w-30"/>
                <Logo className="w-6 md:hidden"/>
            </Link>

            <ul className="hidden gap-6 w-fit ml-12 text-slate-600 lg:flex">
                <li> <Link href="#tecnologies" className="hover:text-amber-500 transition-colors">Tecnologia</Link> </li>
                <li> <Link href="#team" className="hover:text-amber-500 transition-colors">Nosso time</Link> </li>
                <li> <Link href="#questions" className="hover:text-amber-500 transition-colors">Perguntas frequentes</Link> </li>
            </ul>

            <ul className="flex gap-2 w-fit ml-auto md:gap-6">
                <li> 
                    <Link href="/login" className=" flex items-center leading-tight px-4 h-12 text-slate-700 border border-slate-300 rounded-full hover:bg-black/5 active:scale-97 transition-colors duration-200 ease-in-out">Entrar</Link> 
                </li>

                <li> 
                    <Link href="/signup" className="flex relative items-center px-4 h-12 rounded-full text-white text-base font-medium active:scale-97 overflow-hidden whitespace-nowrap group">
                        <span className="hidden md:block z-1 leading-tight">Criar uma conta</span> <span className="block md:hidden z-1">Criar</span>

                        {/* Span para Efeito */}
                        <span className=" absolute -left-100 top-0 w-200 h-full  bg-linear-to-r from-amber-500 via-amber-400 to-amber-500 z-0 transition-all duration-500 group-hover:left-0"></span>
                    </Link> 
                </li>
            </ul>

        </nav>
        </>
    )   
}