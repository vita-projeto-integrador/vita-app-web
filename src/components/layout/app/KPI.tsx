import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronUpIcon, ChevronDownIcon  } from "@heroicons/react/20/solid"

type Period = "Últimos 7 dias" | "Últimos 30 dias" | "Últimos 90 dias" | "Últimos 6 meses" | "Último ano"

type Trend = "increasing" | "decreasing" | "stable"

type Data = {
    description : string
    percent: number
    value: number
    period: Period
    trend: Trend
    reverse?:boolean // Se o indice subir representa algo ruim
    className?: string
}


export const KPI = ({description, percent, value, period, trend, reverse, className}: Data) => {
    return (
        <Card className={className}>
            <CardContent className="select-none">
                <div className="flex gap-4">
                    <CardDescription>{description}</CardDescription>
                    {trend === "increasing" && <Badge variant={reverse ? "destructive" : "success"}><ChevronUpIcon />{percent}%</Badge>}
                    {trend === "decreasing" && <Badge variant={reverse ? "success" : "destructive"}><ChevronDownIcon />{percent}%</Badge>}
                    {trend === "stable" && <Badge variant={"secondary"}>{trend === "stable" ? percent=0 : percent}%</Badge>}
                </div>
                <CardTitle className="text-2xl">{value}</CardTitle>
                <CardDescription>{period}</CardDescription>
            </CardContent>
        </Card>
    )
}