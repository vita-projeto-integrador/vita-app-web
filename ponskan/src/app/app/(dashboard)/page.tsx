"use client"

import { Header } from "@/components/layout/app/Header"
import { KPI } from "@/components/layout/app/KPI"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig, } from "@/components/ui/chart"

const chartData = [
  { day: "Segunda", analise: 186, doenca: 80 },
  { day: "Terça", analise: 305, doenca: 200 },
  { day: "Quarta", analise: 237, doenca: 120 },
  { day: "Quinta", analise: 73, doenca: 190 },
  { day: "Sexta", analise: 209, doenca: 130 },
  { day: "Sábado", analise: 214, doenca: 140 },
  { day: "Domingo", analise: 214, doenca: 140 },
]

const chartConfig = {
  analise: {
    label: "Analisadas",
    color: "var(--chart-1)",
  },
  doenca: {
    label: "Doentes",
    color: "var(--chart-2)",
  },
}

export default function Page() {
  return (
    <>
      <Header />
      
      <div className="flex flex-col h-full overflow-y-scroll p-6 gap-6">
        <div className="flex gap-4 flex-wrap">
          <KPI description="Fotos analizadas" percent={7.5} value={96} period="Últimos 7 dias" trend="increasing" />
          <KPI description="Doença confirmada" percent={7.5} value={5} period="Últimos 7 dias" trend="increasing" />
          <KPI description="Focos de contaminação" percent={7.5} value={2} period="Últimos 7 dias" trend="stable" reverse />
          <KPI description="Tarefas pendentes" percent={7.5} value={12} period="Últimos 7 dias" trend="increasing" reverse />
          <KPI description="Índice de qualidade (%)" percent={1.5} value={89} period="Últimos 7 dias" trend="increasing" />
        </div>

        <div className="flex">
          <Card>
            <CardHeader>
              <CardTitle>Análises de frutos</CardTitle>
              <CardDescription>Últimos 7 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="analise"
                    stackId="a"
                    fill="var(--primary)"
                    radius={[0, 0, 4, 4]}
                  />
                  <Bar
                    dataKey="doenca"
                    stackId="a"
                    fill="var(--chart-1)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 leading-none font-medium">
                Resumo da análise de frutos e confirmação da doença
              </div>
              <div className="leading-none text-muted-foreground">
                Total no periodo dos últimos 7 dias
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  )
}
