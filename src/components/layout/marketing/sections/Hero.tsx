import Link from "next/link"
import { Form } from "@/assets/icons/Form"
import { PlayIcon } from "@/assets/icons/HeroIcons"
import Image from "next/image"
import { Header } from "../Header"

export const Hero = () => {
    return(
        <>
        <section id="hero" className="flex flex-col relative min-h-dvh px-4 select-none">
            <Header />

            <div className="flex flex-1 flex-col justify-center items-center pt-12 gap-6">
                <h1 className="max-w-250 text-center leading-8 text-4xl text-slate-800 font-bold font-lexend md:leading-12 md:text-5xl lg:leading-16 lg:text-6xl z-1">Gerenciamento <span className="bg-linear-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent relative">multiplataforma<Form className="absolute -bottom-6 -z-1 left-0 w-full text-amber-500/35"/></span> de doenças no seu pomar</h1>
                <h2 className="max-w-175 text-center text-md text-slate-500 font-normal font-inter lg:text-xl z-1">Proteja sua safra, reduza em até 30% o uso de defensivos ao identificar o momento biológico exato para a aplicação.<span className="text-amber-500"> Menos desperdício, mais margem.</span></h2>
    
                <div className="flex gap-4 flex-wrap justify-center z-1">
                    <Link href="https://play.google.com/store/apps" className="hidden sm:flex font-lexend flex items-center whitespace-nowrap px-4 h-12 bg-amber-500 text-white text-base font-medium border rounded-full hover:bg-amber-600/90 transition-colors duration-200 ease-in-out">Quero meu pomar saudável</Link>
                    <Link href="/signup" className="flex sm:hidden font-lexend items-center whitespace-nowrap px-4 h-12 bg-amber-500 text-white text-base font-medium border rounded-full hover:bg-amber-600/90 transition-colors duration-200 ease-in-out">Baixar App</Link>
                    <Link href="https://www.youtube.com/watch?v=Qy9XhNMbdHU" className="font-lexend font-normal flex items-center whitespace-nowrap gap-2 px-4 h-12 text-slate-700 border border-slate-300 rounded-full hover:bg-black/5 transition-colors duration-200 ease-in-out"> <PlayIcon className="w-5 h-5 text-slate-600"/> Ver vídeo</Link>
                </div>
            </div>

            <div className="flex flex-1 items-center justify-center">
                <p className="text-slate-700 text-center font-medium font-lexend z-1">As melhores tecnologias do mercado trabalhando junto com você</p>
            </div>

            <Image src="/images/hero-bg.avif" fill sizes="100vw" alt="" className="absolute object-cover opacity-50 z-0"/>
        </section>
        </>
    )
}