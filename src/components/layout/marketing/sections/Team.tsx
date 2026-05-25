import Image from "next/image"
import { HeadlineSection } from "../elements/HeadlineSection"

export const Team = () => {

    const data = [
        {
            description: "Cuido da integridade e segurança dos dados da sua safra. Organizo as informações para que sejam a base sólida e confiável das suas decisões estratégicas.",
            name: "Arthur Parra",
            responsibility: "Gestor de banco de dados",
            imgPath: "/images/arthurParra.webp"
        },
        {
            description: "Realizo testes rigorosos para garantir que a plataforma seja impecável, confiável e livre de falhas para o seu dia a dia.",
            name: "Daniele Fiel",
            responsibility: "Quality Assurance",
            imgPath: "/images/daniFiel.webp"
        },
        {
            description: "Desenvolvo a inteligência do sistema. Foco em performance e estabilidade para garantir que a plataforma processe dados complexos com velocidade e segurança.",
            name: "Guilherme Shimada",
            responsibility: "Desenvolvedor Back-end",
            imgPath: "/images/guilhermeShimada.webp"
        },
        {
            description: "Faço a ponte entre nossa tecnologia e o campo. Transformo funcionalidades complexas em soluções práticas, garantindo que você aproveite o máximo do nosso sistema.",
            name: "Gustavo Kletelinger",
            responsibility: "Comunicação e marketing",
            imgPath: "/images/gustavoKletelinger.webp"
        },
        {
            description: "Crio a interface do sistema, focando em simplicidade e intuitividade. Transformo dados complexos em uma experiência visual clara para facilitar sua gestão.",
            name: "Matheus Bertoldo",
            responsibility: "Desenvolvedor Front-end",
            imgPath: "/images/matheusBertoldo.webp"
        }
    ]

    return(
        <>
        <section id="team" className="flex flex-col w-full min-h-dvh items-center pt-30 pb-22 px-5 bg-slate-50 font-inter select-none">
            <HeadlineSection 
                title="Nosso time de especialistas à sua disposição" 
                subtitle="Uma equipe inteira para te atender da melhor forma"
            />

            <div className="grid grid-cols-1 w-full max-w-300 gap-6 justify-items-center md:grid-cols-2 lg:grid-cols-3">
                {
                    data.map((item, index) => {
                        return(
                            // Cards individuais
                            <div key={index} className="flex flex-col px-4 py-4 max-w-100 bg-white rounded-2xl shadow-xl group overflow-hidden select-none hover:border-amber-500">
                                {/* Message */}
                                <div className="flex flex-col flex-1 pb-4 mb-4 relative border-b border-slate-200">
                                    <p className="absolute top-0 left-0 font-lexend text-9xl leading-24 text-slate-700/10">"</p> 
                                    <p className="text-lg text-slate-700 leading-8">{item.description}</p>
                                </div>

                                {/* author */}
                                <div className="flex items-center gap-4 px-2">
                                    <div className="flex flex-col">
                                        <p className="font-lexend text-slate-700">{item.name}</p>
                                        <p className="text-md text-slate-500 font-light">{item.responsibility}</p>
                                    </div>

                                    <div className="w-12 h-12 ml-auto rounded-full bg-slate-300 overflow-hidden">
                                        <Image src={item.imgPath} width={200} height={200} alt={item.name}/>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </section>
        </>
    )
}