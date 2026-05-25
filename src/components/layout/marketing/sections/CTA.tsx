import Link from "next/link"

export const CTA = () => {
    return (
        <>
        <section className="flex flex-col w-full h-125 items-center justify-center gap-8 px-5 bg-amber-500 select-none font-inter">
            <h3 className="max-w-175 text-center text-5xl font-medium font-lexend text-slate-50">Não deixe sua safra se desvalorizar</h3>
            <p className="max-w-125 text-center text-base text-white">Aumente sua área de atuação sem perder o controle, utilizando processos automatizados que crescem com seu negócio.</p>
            <Link href="/signup" className="font-lexend flex items-center px-4 h-12 rounded-full bg-slate-50 text-base font-medium text-amber-600 hover:bg-slate-100/93 transition-colors ">Quero minha safra produzindo</Link>
        </section>
        </>
    )
}