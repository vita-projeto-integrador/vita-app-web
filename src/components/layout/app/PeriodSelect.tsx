'use client'

import { useSyncExternalStore } from "react"
import { Calendar } from "lucide-react"
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PERIOD_OPTIONS, type Period } from "@/lib/map"

// Rótulos do dropdown (os de lib/map.ts são curtos, feitos para os botões do mobile)
// Record<Period, ...> obriga a escrever um rótulo para cada período novo
const PERIOD_LABELS: Record<Period, string> = {
    "7d": "Últimos 7 dias",
    "30d": "Últimos 30 dias",
    "12m": "Últimos 12 meses",
    tudo: "Todo o período",
}

// "4 novembro, 2026", como no protótipo
function formatToday() {
    const today = new Date()
    const month = today.toLocaleDateString("pt-BR", { month: "long" })
    return `${today.getDate()} ${month}, ${today.getFullYear()}`
}

interface Props {
    value: Period
    onChange: (value: Period) => void
}

// A data não muda enquanto a página está aberta: não há o que observar
const subscribe = () => () => {}

export const PeriodSelect = ({ value, onChange }: Props) => {
    // O HTML da página é gerado no build. Calculada no servidor, a data do build
    // ficaria congelada na tela; por isso o servidor usa "" e o navegador, a data de hoje
    const today = useSyncExternalStore(subscribe, formatToday, () => "")

    return (
        <ButtonGroup>
            <ButtonGroupText className="bg-white font-normal">
                <Calendar />
                Data atual - {today}
            </ButtonGroupText>

            {/* O Select devolve string; os valores vêm de PERIOD_OPTIONS, então o cast é seguro */}
            <Select value={value} onValueChange={(selected) => onChange(selected as Period)}>
                <SelectTrigger className="bg-white">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {PERIOD_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                            {PERIOD_LABELS[option.value]}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </ButtonGroup>
    )
}