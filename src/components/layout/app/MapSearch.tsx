'use client'

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Props {
    value: string
    onChange: (value: string) => void
}

// Barra de busca do mapa. Ainda não filtra nada: as APIs não têm busca
export const MapSearch = ({ value, onChange }: Props) => {
    return (
        <div className="relative w-full max-w-md">
            {/* Ícone por cima do input; pointer-events-none deixa o clique passar para o campo */}
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="search"
                aria-label="Buscar análises"
                placeholder="Buscar..."
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="bg-white pl-8"
            />
        </div>
    )
}