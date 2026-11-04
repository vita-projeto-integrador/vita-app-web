"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { Header } from "@/components/layout/app/Header"
import { MapFilters } from "@/components/layout/app/MapFilters"
import { SheetDetailsAnalysis } from "@/components/layout/app/SheetDetailsAnalysis"
import { AnalysisDetails, type DataAnalysis } from "@/services/AnalysisDetails"
import { getMapAnalyses, type AnalysisMapItem, type MapClasse } from "@/services/getMapAnalysis"
import { getPeriodRange, MAP_LEGEND, type Period } from "@/lib/map"

// O Leaflet usa 'window', que não existe no servidor: o mapa só carrega no navegador
const AnalysesMap = dynamic(
    () => import("@/components/layout/app/AnalysesMap").then(module => module.AnalysesMap),
    { ssr: false, loading: () => <p className="p-4 text-sm">Carregando mapa...</p> }
)

export default function Page() {
    // Filtros (valores iniciais: últimos 30 dias, todos os status e resultados)
    const [period, setPeriod] = useState<Period>("30d")
    const [status, setStatus] = useState("")
    const [classe, setClasse] = useState<MapClasse | "">("")

    const [analyses, setAnalyses] = useState<AnalysisMapItem[]>([])
    const [total, setTotal] = useState(0)
    const [message, setMessage] = useState("")

    // Folha de detalhes (a mesma da página de análises)
    const [details, setDetails] = useState<DataAnalysis>()
    const [isOpen, setIsOpen] = useState(false)

    // Busca os pontos sempre que um filtro muda
    useEffect(() => {
        const loadAnalyses = async () => {
            const response = await getMapAnalyses({
                ...getPeriodRange(period),
                status: status || undefined, // "" = sem filtro
                classe: classe || undefined,
            })

            if (!response.success) {
                setMessage(response.message)
                return
            }
            setAnalyses(response.data.items)
            setTotal(response.data.total)
            setMessage(response.data.items.length === 0 ? "Nenhuma análise com localização neste filtro" : "")
        }
        loadAnalyses()
    }, [period, status, classe])

    // Só análises finalizadas têm resultado para mostrar (igual à tabela de análises)
    const openDetails = async (item: AnalysisMapItem) => {
        if (item.status !== "finalizada") {
            setMessage(item.status === "falhou" ? "Esta análise falhou." : "Esta análise ainda está em andamento.")
            return
        }
        const response = await AnalysisDetails(item.id)
        if (!response.success) {
            setMessage(response.message)
            return
        }
        setDetails(response.data)
        setIsOpen(true)
    }

    // Só análises finalizadas têm resultado: escolher um resultado fixa o status
    const changeClasse = (value: MapClasse | "") => {
        setClasse(value)
        if (value) setStatus("finalizada")
    }

    return (
        <>
            <Header />
            <SheetDetailsAnalysis isOpen={isOpen} onOpenChange={setIsOpen} data={details} />

            <div className="flex flex-col p-8 w-full h-full gap-4 overflow-y-auto">
                <MapFilters
                    period={period}
                    status={status}
                    classe={classe}
                    onChangePeriod={setPeriod}
                    onChangeStatus={setStatus}
                    onChangeClasse={changeClasse}
                />

                <div className="flex flex-wrap items-center gap-4 text-sm">
                    {MAP_LEGEND.map(entry => (
                        <span key={entry.label} className="flex items-center gap-1.5">
                            <span className="size-3 rounded-full" style={{ backgroundColor: entry.color }} />
                            {entry.label}
                        </span>
                    ))}
                    {total > analyses.length && (
                        <span className="text-muted-foreground">Mostrando as {analyses.length} mais recentes de {total}</span>
                    )}
                    {message && <span className="text-muted-foreground">{message}</span>}
                </div>

                {/* 'relative z-0' isola as camadas do Leaflet: sem isso o mapa fica por cima da folha de detalhes */}
                <div className="relative z-0 flex-1 min-h-[480px] rounded-xl border overflow-hidden">
                    <AnalysesMap analyses={analyses} onSelect={openDetails} />
                </div>
            </div>
        </>
    )
}