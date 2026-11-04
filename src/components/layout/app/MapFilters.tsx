'use client'

import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { MapClasse } from "@/services/getMapAnalysis"
import { CLASSE_OPTIONS, STATUS_OPTIONS } from "@/lib/map"

interface Props {
    status: string
    classe: MapClasse | ""
    onChangeStatus: (value: string) => void
    onChangeClasse: (value: MapClasse | "") => void
    onClear: () => void
}

// Por padrão o menu fecha a cada escolha; assim dá para marcar status e resultado de uma vez
const keepOpen = (event: Event) => event.preventDefault()

export const MapFilters = ({ status, classe, onChangeStatus, onChangeClasse, onClear }: Props) => {
    // Quantos filtros estão ativos (aparece no botão, já que o menu fica fechado)
    const activeCount = (status ? 1 : 0) + (classe ? 1 : 0)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white">
                    Filtrar
                    {activeCount > 0 && (
                        <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">{activeCount}</span>
                    )}
                    <ChevronDown />
                </Button>
            </DropdownMenuTrigger>

            {/* w-56: sem isso o menu fica da largura do botão */}
            <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={status} onValueChange={onChangeStatus}>
                    {STATUS_OPTIONS.map(option => (
                        <DropdownMenuRadioItem key={option.label} value={option.value} onSelect={keepOpen}>
                            {option.label}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>Resultado</DropdownMenuLabel>
                {/* O valor devolvido é string; as opções vêm de CLASSE_OPTIONS, então o cast é seguro */}
                <DropdownMenuRadioGroup value={classe} onValueChange={(value) => onChangeClasse(value as MapClasse | "")}>
                    {CLASSE_OPTIONS.map(option => (
                        <DropdownMenuRadioItem key={option.label} value={option.value} onSelect={keepOpen}>
                            {option.label}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem disabled={activeCount === 0} onSelect={onClear}>
                    Limpar filtros
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}