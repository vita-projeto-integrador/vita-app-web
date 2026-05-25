import { HeadlineSection } from "../elements/HeadlineSection"
import Image from "next/image"

export const Questions = () => {
    const data = [
        {
            question: "Como o sistema identifica a pinta preta nas frutas?",
            answer: "Utilizamos visão computacional para reconhecer padrões visuais da pinta preta na superfície da fruta, detectando lesões precoces invisíveis a olho nu."
        },
        {
            question: "O monitoramento é em tempo real?",
            answer: "Sim. As imagens são processadas instantaneamente, gerando alertas automáticos assim que uma anomalia é detectada no pomar."
        },
        {
            question: "Funciona sem internet no campo?",
            answer: "Sim. O sistema pode processar dados localmente e sincronizar os relatórios com a nuvem assim que houver sinal disponível."
        },
        {
            question: "Como o projeto reduz custos?",
            answer: "Ao identificar focos específicos, permite a aplicação localizada de fungicidas, economizando insumos e reduzindo o impacto ambiental."
        },
        {
            question: "Qual o impacto na exportação?",
            answer: "Garante que os lotes atendam aos rigorosos padrões fitossanitários internacionais, aumentando o valor comercial e a aceitação no mercado externo."
        },
        {
            question: "Quais relatórios são gerados?",
            answer: "O sistema entrega mapas de calor das áreas afetadas, históricos de evolução da doença e alertas de risco para suporte à decisão."
        },
    ]

    return(
        <>
        <section id="questions" className="flex flex-col w-full min-h-dvh pt-30 pb-22 px-5 relative font-inter bg-amber-500 select-none ">
            <HeadlineSection title="Perguntas Frequentes" subtitle="Entenda como a Ponskan transforma a tecnologia em resultados para sua colheita" className="text-white z-1" />
            <Image src="/images/bg.avif" fill sizes="100vw" alt="" className="absolute object-cover opacity-25 z-0"/>

            <div className="grid grid-cols-1 gap-y-4 gap-x-5 max-w-300 justify-items-center select-none mx-auto z-1 md:grid-cols-2 lg:justify-items-normal">
                {
                    data.map((item, index) => {
                        return(
                            <div key={index} className="flex flex-col px-4 py-4 gap-1 rounded-xl transition-all hover:bg-amber-50/10">
                                <h3 className="text-xl font-semibold text-amber-900 font-lexend">{item.question}</h3>
                                <p className="text-white">{item.answer}</p>
                            </div>
                        )
                    })
                }

            </div>
        </section>
        </>
    )
}