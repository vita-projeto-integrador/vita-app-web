import { Badge } from "@/components/ui/badge"
import { MAP_LEGEND } from "@/lib/map"

// Legenda abaixo do mapa: uma etiqueta por cor de ponto
export const MapLegend = () => {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Legenda</span>
            <div className="flex flex-wrap gap-2">
                {MAP_LEGEND.map(entry => (
                    <Badge key={entry.label} variant="outline" className="h-6 gap-1.5 bg-white px-2.5 text-sm font-normal">
                        <span className="size-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                        {entry.label}
                    </Badge>
                ))}
            </div>
        </div>
    )
}