'use client'

import { Button } from "@/components/ui/button"
import type { MapClasse } from "@/services/getMapAnalysis"
import { CLASSE_OPTIONS, PERIOD_OPTIONS, STATUS_OPTIONS, type Period } from "@/lib/map"

interface ChipRowProps<T extends string> {
    label: string
    options: { value: T; label: string }[]
    value: T
    onChange: (value: T) => void
}

// Uma linha de botões em que só um fica ativo
function ChipRow<T extends string>({ label, options, value, onChange }: ChipRowProps<T>) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="w-24 text-sm text-muted-foreground">{label}</span>
            {options.map(option => (
                <Button
                    key={option.label}
                    size="sm"
                    variant={option.value === value ? "default" : "outline"}
                    onClick={() => onChange(option.value)}
                >
                    {option.label}
                </Button>
            ))}
        </div>
    )
}

interface Props {
    period: Period
    status: string
    classe: MapClasse | ""
    onChangePeriod: (value: Period) => void
    onChangeStatus: (value: string) => void
    onChangeClasse: (value: MapClasse | "") => void
}

export const MapFilters = (props: Props) => {
    return (
        <div className="flex flex-col gap-2">
            <ChipRow label="Período" options={PERIOD_OPTIONS} value={props.period} onChange={props.onChangePeriod} />
            <ChipRow label="Status" options={STATUS_OPTIONS} value={props.status} onChange={props.onChangeStatus} />
            <ChipRow label="Resultado" options={CLASSE_OPTIONS} value={props.classe} onChange={props.onChangeClasse} />
        </div>
    )
}