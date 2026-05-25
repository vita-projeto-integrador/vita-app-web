import { HeadlineSection } from "../elements/HeadlineSection"
import Image from "next/image"
import { CalendarIcon, ChevronDownIcon, DocumentIcon, CheckIcon } from "@/assets/icons/HeroIcons"

export const Devices = () => {
    return(
        <>
        <section id="devices" className="relative flex flex-col items-center min-h-dvh py-22 px-4 bg-amber-500 select-none">
    <HeadlineSection className="z-1 text-white" title="Gerencie seu pomar por onde quiser" subtitle="Todas as informações necessárias em qualquer lugar" />

    {/* Container do Grid: Removido o aspect-video fixo para permitir altura dinâmica no mobile */}
    <div className="relative grid w-full max-w-300 p-4 gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 z-1 font-lexend">
        
        {/* Card 1: Lado a lado com o produtor. */}
        <div className="relative hidden md:flex flex-col col-span-1 row-span-2 px-6 pt-6 overflow-hidden rounded-3xl bg-amber-200 shadow-lg transition-all hover:scale-103">
            <p className="pb-2 text-xl font-bold font-lexend text-amber-800">Lado a lado com o produtor</p>

            {/* Ajuste de largura responsiva para a imagem */}
            <div className="absolute left-0 -bottom-18 w-40 md:w-65 lg:w-80 aspect-square">
                <div className="relative flex flex-1 w-full h-full">
                    <Image fill src="/images/person.webp" alt="" className="object-cover" />
                </div>
            </div>
        </div>

        {/* Card 2: KPI de Acurácia IA. */}
        <div className="hidden md:flex flex-col justify-between col-span-1 row-span-1 p-6 rounded-3xl bg-linear-to-br from-amber-50 to-slate-200 shadow-lg transition-all hover:scale-103">
            <span className="text-xs font-bold tracking-wider text-amber-500">Acurácia IA</span>
            <p className="text-4xl font-black text-slate-700 tracking-tight">99.8%</p>
            <p className="mt-1 text-xs font-medium text-slate-500">Taxa de identificação</p>
        </div>

        {/* Card 3: KPI de Plantas Monitoradas. */}
        <div className="hidden md:flex flex-col justify-between col-span-1 row-span-1 p-6 rounded-3xl bg-linear-to-br from-amber-50 to-slate-200 shadow-lg transition-all hover:scale-103">
            <span className="text-xs font-bold tracking-wider text-amber-500">Plantas Monitoradas</span>
            <p className="text-4xl font-black text-slate-700 tracking-tight">1.240</p>
            <p className="text-xs font-bold text-emerald-600">+12% hoje</p>
        </div>

        {/* Card 4: Status do Pomar. (Oculto em mobile para manter foco) */}
        <div className="hidden lg:flex flex-col items-center justify-between col-span-1 row-span-2 px-4 py-8 rounded-3xl bg-amber-100 shadow-lg transition-all hover:scale-103">
            <CheckIcon className="w-24 px-2 py-2 text-white bg-amber-500 rounded-full" />
            <p className="text-xl font-medium text-amber-600">Pomar Saudável</p>
            <p className="text-center text-amber-400">Todas as medidas de controle foram eficazes</p>
            <p className="px-3 py-2 text-white rounded-full bg-amber-500">Voltar para Home</p>
        </div>

        {/* Card 5: Mockup central. (Ajustado tamanho da imagem) */}
        <div className="relative flex flex-col col-span-1 md:col-span-2 row-span-2 px-6 py-6 pt-6 overflow-hidden rounded-3xl bg-slate-50 shadow-lg transition-all hover:scale-103">
            <p className="pb-2 text-3xl lg:text-4xl font-bold font-lexend text-amber-600 max-w-85 lg:max-w-100">Eficiência operacional e monitoramento inteligente</p>

            {/* Ajuste responsivo do mockup: sai de 80 para 150 conforme tela cresce */}
            <div className="absolute -right-20 md:-right-40 lg:-right-70 -bottom-20 md:-bottom-45 w-60 md:w-100 lg:w-150 aspect-square">
                <div className="relative flex flex-1 w-full h-full">
                    <Image fill src="/images/mockup.webp" alt="" className="object-cover" />
                </div>
            </div>
        </div>

        {/* Card 6: KPI de Redução de Fungicida. */}
        <div className="flex flex-col justify-between h-full col-span-1 row-span-1 p-6 rounded-3xl bg-linear-to-br from-slate-50 to-slate-200 shadow-lg transition-all hover:scale-103">
            <span className="text-xs font-bold tracking-wider text-amber-500">Redução de Fungicida</span>
            <p className="text-4xl font-black text-slate-700 tracking-tight">24%</p>
            <p className="mt-1 text-xs font-medium text-slate-500">Economia mensal acumulada</p>
        </div>

        {/* Card 7: Branding Ponskan. */}
        <div className="relative hidden md:flex lg:flex flex-col col-span-1 row-span-2 px-6 pt-6 overflow-hidden rounded-3xl bg-amber-200 shadow-lg transition-all hover:scale-103">
            <p className="pb-2 text-5xl font-bold font-lexend text-amber-800">Ponskan</p>
            <p className="pb-2 text-5xl font-medium font-lexend text-amber-800">Ponskan</p>
            <p className="pb-2 text-5xl font-normal font-lexend text-amber-800">Ponskan</p>
            <p className="pb-2 text-5xl font-light font-lexend text-amber-800">Ponskan</p>
            <p className="pb-2 text-5xl font-extralight font-lexend text-amber-800">Ponskan</p>

            <div className="absolute -right-22 bottom-0 w-70 aspect-square">
                <div className="relative flex flex-1 w-full h-full">
                    <Image fill src="/images/men.webp" alt="" className="object-cover" />
                </div>
            </div>
        </div>

        {/* Card 8: Controles. */}
        <div className="py-6 px-6 flex flex-wrap items-center justify-center col-span-1 md:col-span-2 row-span-1 gap-4 rounded-3xl bg-linear-to-br from-slate-50 to-slate-200 shadow-lg transition-all hover:scale-103">
            <div className="flex text-slate-600 border border-slate-300 rounded-xl shadow">
                <span className="flex gap-2 px-2 py-2 whitespace-nowrap"><CalendarIcon className="w-6" />Data atual - 15 abril, 2026<ChevronDownIcon className="w-6" /></span>
            </div>

            <div className="flex items-center justify-center gap-2 px-2 py-2 text-slate-50 bg-amber-500 rounded-xl shadow-md whitespace-nowrap ">
                <DocumentIcon className="w-5" /> <span>Exportar para PDF</span>
            </div>
        </div>

        {/* Card 9: Relatórios finalizados. */}
        <div className="flex flex-col justify-between col-span-1 row-span-1 p-6 rounded-3xl bg-linear-to-br from-slate-50 to-slate-200 shadow-lg transition-all hover:scale-103">
            <span className="text-xs font-bold tracking-wider text-amber-500">Relatórios finalizados</span>
            <p className="text-4xl font-black text-slate-700 tracking-tight">14</p>
            <p className="mt-1 text-xs font-medium text-slate-500">Nos últimos 30 dias</p>
        </div>
    </div>
    
    {/* Para decoração do bg */}
    <Image src="/images/bg.avif" fill sizes="100vw" alt="" className="absolute z-0 object-cover opacity-35" />
</section>
        </>
    )
}