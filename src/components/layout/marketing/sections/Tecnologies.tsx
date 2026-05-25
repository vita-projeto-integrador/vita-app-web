import { DevicePhoneMobileIcon, CpuChipIcon, CloudArrowUpIcon, DocumentTextIcon, MapPinIcon, ArrowTrendingUpIcon } from "@/assets/icons/HeroIcons"
import React from "react"
import { HeadlineSection } from "../elements/HeadlineSection"

export const Tecnologies = () => {

    const data = [
        {
            icon: <DevicePhoneMobileIcon />,
            tag: "Dispositivos",
            title: "Monitoramento multiplataforma",
            description: "Monitoramento via dispositivos móveis, captação de imagens da planta infectada"
        },
        {
            icon: <CpuChipIcon />,
            tag: "IA",
            title: "Melhores diagnósticos",
            description: "Usamos o poder da inteligência artificial para entregar os melhores resultados"
        },
        {
            icon: <CloudArrowUpIcon />,
            tag: "Nuvem",
            title: "Disponibilidade 24h",
            description: "Acesse todas as informações necessárias em qualquer hora e lugar"
        },
        {
            icon: <DocumentTextIcon />,
            tag: "Relatórios",
            title: "Decisões baseadas em dados",
            description: "Suas decisões baseadas em todas as informações necessárias"
        },
        {
            icon: <MapPinIcon />,
            tag: "Localização",
            title: "Saiba exatamente onde está o problema",
            description: "Foque os esforços exatamente onde é necessário"
        },
        {
            icon: <ArrowTrendingUpIcon />,
            tag: "Eficiência",
            title: "Otimização de recursos",
            description: "Aplique defensivos e fertilizantes apenas onde é necessário, economizando recursos e aumentando a rentabilidade"
        }
    ]

    return(
        <>
        <section id="tecnologies" className="flex flex-col w-full min-h-dvh items-center pt-30 pb-22 px-4 font-inter select-none">
            <HeadlineSection title="Enquanto a tecnologia protege a safra prospera" subtitle="Entenda como nossa tecnologia vai beneficiar sua produção" />
            
            <div className="grid grid-cols-1 h-full gap-5 md:grid-cols-2 lg:grid-cols-3 lg:max-w-300">
                {
                    data.map((item, index) => {
                        return (
                            <div key={index} className="flex flex-col gap-2 px-4 py-4 rounded-xl transition-colors group hover:bg-slate-100/50">
                                <div className="w-fit h-fit px-2 py-2 rounded-md bg-slate-400 transition-colors group-hover:bg-amber-500">
                                    {
                                        // React.cloneElement(elemento, propsAdicionais, ...novosFilhos) -> adicionar css nos ícones salvos na lista de objetos
                                        React.cloneElement(item.icon, { className : "w-5 h-5 fill-slate-50"})
                                    }
                                </div>

                                <p className="text-amber-500"> {item.tag} </p>
                                <h3 className="text-2xl text-slate-600 font-medium font-lexend"> {item.title} </h3>
                                <p className="text-sm text-slate-500"> {item.description} </p>
                            </div>
                        )
                    })
                }
            </div>
        </section>
        </>
    )
}