'use client'

import "leaflet/dist/leaflet.css"
import { useEffect } from "react"
import { CircleMarker, MapContainer, TileLayer, Tooltip, useMap } from "react-leaflet"
import type { AnalysisMapItem } from "@/services/getMapAnalysis"
import { getMapLabel, getPinColor } from "@/lib/map"

// Único arquivo do web que conhece a biblioteca de mapa (Leaflet)

interface Props {
    analyses: AnalysisMapItem[]
    onSelect: (item: AnalysisMapItem) => void
}

// Centro inicial antes de carregar os pontos (Vale do Ribeira, SP)
// Atenção: o Leaflet usa [latitude, longitude]
const INITIAL_CENTER: [number, number] = [-24.49, -47.84]

// Enquadra todos os pontos quando a lista muda (precisa ficar dentro do MapContainer)
function FitToPoints({ analyses }: { analyses: AnalysisMapItem[] }) {
    const map = useMap()

    useEffect(() => {
        if (analyses.length === 0) return
        const points = analyses.map(item => [item.latitude, item.longitude] as [number, number])
        map.fitBounds(points, { padding: [40, 40], maxZoom: 18 })
    }, [analyses, map])

    return null
}

export const AnalysesMap = ({ analyses, onSelect }: Props) => {
    return (
        <MapContainer center={INITIAL_CENTER} zoom={10} className="h-full w-full">
            {/* Imagem de satélite da Esri (a atribuição é obrigatória) */}
            <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri"
                maxZoom={19}
            />

            <FitToPoints analyses={analyses} />

            {analyses.map(item => (
                <CircleMarker
                    key={item.id}
                    center={[item.latitude, item.longitude]}
                    radius={9}
                    pathOptions={{ color: "#FFFFFF", weight: 2, fillColor: getPinColor(item), fillOpacity: 1 }}
                    eventHandlers={{ click: () => onSelect(item) }}
                >
                    {/* Texto que aparece ao passar o mouse */}
                    <Tooltip>
                        {getMapLabel(item)} · {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                    </Tooltip>
                </CircleMarker>
            ))}
        </MapContainer>
    )
}