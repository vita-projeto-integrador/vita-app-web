'use client'

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Dispatch, SetStateAction } from "react"
import { DataAnalysis } from "@/services/AnalysisDetails"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Props {
    data: DataAnalysis | undefined
    isOpen: boolean
    onOpenChange: Dispatch<SetStateAction<boolean>>
}

export const SheetDetailsAnalysis = ({ data, isOpen = false, onOpenChange }: Props) => {

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="flex flex-col select-none h-screen">
                <SheetHeader>
                    <SheetTitle>Detalhes</SheetTitle>
                    <SheetDescription>Mais informações sobre a análise</SheetDescription>
                </SheetHeader>

                <Tabs className="flex flex-col flex-1 min-h-0">
                    <TabsList className="w-full max-w-[90%] mx-auto">
                        <TabsTrigger value="details">Detalhes</TabsTrigger>
                        <TabsTrigger value="actionPlan">Plano de ação</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="flex-1 min-h-0 overflow-y-auto bg-slate-50">
                        <div className="flex flex-col p-4 gap-4 w-full ">
                            <div className="flex flex-col gap-4 p-4 bg-white rounded-xl border border-slate-100">
                                <div className="flex items-center border-b border-slate-100 pb-3">
                                    <div className="flex flex-col gap-1">
                                        <Label className="text-xs text-muted-foreground">Id da análise</Label>
                                        <p className="text-sm font-mono font-medium text-slate-700">{data?.id}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <Label className="text-xs text-muted-foreground">Status</Label>
                                        <span className="text-sm font-semibold text-slate-800 capitalize">
                                            {data?.status}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <Label className="text-xs text-muted-foreground">Data da Análise</Label>
                                        <span className="text-sm text-slate-600">
                                            {data?.createdAt ? new Date(data.createdAt).toLocaleDateString('pt-BR') : '---'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 p-4 bg-white rounded-xl border border-slate-100">
                                <div className="border-b border-slate-100 pb-2">
                                    <h4 className="text-sm font-semibold text-slate-900">Resultado do Modelo Visão Computacional</h4>
                                </div>

                                <div className={`p-3 rounded-lg flex flex-col gap-1 border ${data?.classification.class === "true"
                                    ? "bg-red-50 border-red-200 text-red-900"
                                    : "bg-green-50 border-green-200 text-green-900"
                                    }`}>
                                    <Label className="text-xs opacity-80">Diagnóstico de Pinta Preta</Label>
                                    <span className="text-lg font-bold flex items-center gap-1.5">
                                        {data?.classification.class === "true" ? "Pinta Preta Detectada" : "Fruta Saudável"}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="flex flex-col gap-1">
                                        <Label className="text-xs text-muted-foreground">Confiança do Modelo</Label>
                                        <span className="text-sm font-semibold text-slate-800">
                                            {data?.classification.assurance ? `${(data?.classification.assurance * 100).toFixed(2)}%` : '---'}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <Label className="text-xs text-muted-foreground">Tempo de Execução</Label>
                                        <span className="text-sm font-medium text-slate-600">
                                            {data?.classification.timeExec ? `${data.classification.timeExec} ms` : '---'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1 border-t border-slate-100 pt-3">
                                    <Label className="text-xs text-muted-foreground">Rede Neural Utilizada (CNN)</Label>
                                    <span className="text-xs font-mono text-slate-500 bg-slate-50 p-2 rounded-md border border-slate-100">
                                        {data?.classification.modell_cnn || 'Não especificado'}
                                    </span>
                                </div>
                            </div>

                        </div>
                    </TabsContent>

                    <TabsContent value="actionPlan" className="flex-1 min-h-0 overflow-y-auto bg-slate-50">
                        <div className="flex flex-col p-4 gap-4 w-full">
                            <div className="flex items-center border-b border-slate-100 pb-3">
                            <div className="flex flex-col gap-4 p-4 bg-white rounded-xl border border-slate-100">
                                
                                <div className="flex flex-col gap-1">
                                    <Label className="text-xs text-muted-foreground">Plano de ação</Label>
                                    <p>Estamos trabalhando nisso...</p>
                                </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    )
}