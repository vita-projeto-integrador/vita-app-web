'use client'

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Dispatch, SetStateAction, } from "react"
import Image from "next/image"
import { DataAnalysis } from "@/services/AnalysisDetails"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { ImageLightBox } from "./ImageLightBox"

interface Props {
    data: DataAnalysis | undefined // Deixar undefined para não precisar definir um estado inicial dentro de useState (muito código desnecessário)
    isOpen: boolean
    onOpenChange: Dispatch<SetStateAction<boolean>>
}

export const SheetDetailsAnalysis = ({ data, isOpen = false, onOpenChange }: Props) => {
    const [isOpenLightBox, setIsOpenLightBox] = useState(false)
    const [pathLightBox, setPathLightBox] = useState("")

    const openLightBox = (path: string) => {
        setIsOpenLightBox(true)
        setPathLightBox(path)
    }

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
                        <TabsTrigger value="actionPlan">Ações imediatas</TabsTrigger>
                    </TabsList>

                    {/* Detalhes da análise */}
                    <TabsContent value="details" className="flex-1 min-h-0 overflow-y-auto bg-slate-50">
                        <div className="flex flex-col p-4 gap-4 w-full ">
                            {/* Card 1 - id */}
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

                            {/* Card 2 - resultados da classificação */}
                            <div className="flex flex-col gap-4 p-4 bg-white rounded-xl border border-slate-100">
                                <div className="border-b border-slate-100 pb-2">
                                    <h4 className="text-sm font-semibold text-slate-900">Resultado do Modelo Visão Computacional</h4>
                                </div>

                                <div className={`p-3 rounded-lg flex flex-col gap-1 border ${data?.classificacao.classe == "1"
                                    ? "bg-red-50 border-red-200 text-red-900"
                                    : "bg-green-50 border-green-200 text-green-900"
                                    }`}>
                                    <Label className="text-xs opacity-80">Diagnóstico de Pinta Preta</Label>
                                    <span className="text-lg font-bold flex items-center gap-1.5">
                                        {data?.classificacao.classe == "1" ? "Pinta Preta Detectada" : "Fruta Saudável"}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="flex flex-col gap-1">
                                        <Label className="text-xs text-muted-foreground">Confiança do Modelo</Label>
                                        <span className="text-sm font-semibold text-slate-800">
                                            {data?.classificacao.confianca ? `${(data?.classificacao.confianca * 100).toFixed(2)}%` : '---'}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <Label className="text-xs text-muted-foreground">Tempo de Execução</Label>
                                        <span className="text-sm font-medium text-slate-600">
                                            {data?.classificacao.tempo_execucao ? `${data.classificacao.tempo_execucao} ms` : '---'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1 border-t border-slate-100 pt-3">
                                    <Label className="text-xs text-muted-foreground">Rede Neural Utilizada (CNN)</Label>
                                    <span className="text-xs font-mono text-slate-500 bg-slate-50 p-2 rounded-md border border-slate-100">
                                        {data?.classificacao.modelo_cnn || 'Não especificado'}
                                    </span>
                                </div>
                            </div>

                            {/* Card 3 - imagens*/}
                            <div className="flex flex-col gap-4 p-4 bg-white rounded-xl border border-slate-100">
                                <div className="flex items-center border-b border-slate-100 pb-3">
                                    <div className="flex flex-col gap-1">
                                        <Label className="text-xs text-muted-foreground">Imagens</Label>
                                        <p className="text-sm font-mono font-medium text-slate-700"></p>
                                    </div>
                                </div>

                                {/* Elemento que exibe a imagem clicada em tamanho maior */}
                                <ImageLightBox isOpen={isOpenLightBox} onOpenChange={setIsOpenLightBox} path={pathLightBox} />

                                {
                                    data?.imagem ? ( // Exibe conteúdo em caso de existencia ou não de imagem
                                        <div className="grid grid-cols-4 gap-3">
                                            {
                                                data.imagem.map((item, i) => (
                                                    <div 
                                                        key={i} 
                                                        onClick={() => openLightBox(`http://localhost:8080/${item.caminho}`)} 
                                                        className="relative w-full aspect-square rounded-xl border border-slate-100 overflow-hidden hover:outline-2 transition-all"
                                                    >
                                                        <Image
                                                            src={`http://localhost:8080/${item.caminho}`}
                                                            fill
                                                            alt="Imagem"
                                                            quality={25}
                                                        />
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    ) : (
                                        <div>Nenhuma imagem encontrada</div>
                                    )
                                }
                            </div>
                        </div>
                    </TabsContent>

                    {/* Ações imediatas */}
                    <TabsContent value="actionPlan" className="flex-1 min-h-0 overflow-y-auto bg-slate-50">
                        <div className="flex flex-col p-4 gap-4">
                            {
                                // Doença não detectada
                                data?.classificacao.classe == "0" && (
                                    <div className="flex flex-col gap-4 flex-1 items-center pb-3">
                                        {/* Card */}
                                        <div className="flex flex-col gap-4 p-4 w-full bg-green-600/5 rounded-xl border border-slate-100">
                                            <div className="flex flex-col gap-1">
                                                <Label className="text-xs text-green-900">Monitoramento</Label>
                                                <p>Aplicação de defensivos cúpricos (à base de cobre) durante o crescimento dos frutos.</p>
                                            </div>
                                        </div>
                                        {/* Card */}
                                        <div className="flex flex-col gap-4 p-4 w-full bg-green-600/5 rounded-xl border border-slate-100">
                                            <div className="flex flex-col gap-1">
                                                <Label className="text-xs text-green-900">Nutrição preventiva</Label>
                                                <p>Reforço nutricional com Potássio, Cálcio e de fosfitos</p>
                                            </div>
                                        </div>
                                        {/* Card */}
                                        <div className="flex flex-col gap-4 p-4 w-full bg-green-600/5 rounded-xl border border-slate-100">
                                            <div className="flex flex-col gap-1">
                                                <Label className="text-xs text-green-900">Biossegurança</Label>
                                                <p>Manter maquinários e ferramentas lavadas para evitar a contaminação vinda de outras áreas</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            {
                                data?.classificacao.classe == "1" && (
                                    // Doença detectada
                                    <div className="flex flex-col gap-4 flex-1 items-center pb-3">
                                        {/* Card */}
                                        <div className="flex flex-col gap-4 p-4 w-full bg-destructive/5 rounded-xl border border-slate-100">
                                            <div className="flex flex-col gap-1">
                                                <Label className="text-xs text-red-900">Pulverização preventiva</Label>
                                                <p>Revisão do calendário de pulverização e aplicação de fungicida localizado</p>
                                            </div>
                                        </div>
                                        {/* Card */}
                                        <div className="flex flex-col gap-4 p-4 w-full bg-amber-600/5 rounded-xl border border-slate-100">
                                            <div className="flex flex-col gap-1">
                                                <Label className="text-xs text-amber-900">Manejo de serrapilheira</Label>
                                                <p>Triturar folhas caídas e aplicar produtos para acelerar decomposição</p>
                                            </div>
                                        </div>
                                        {/* Card */}
                                        <div className="flex flex-col gap-4 p-4 w-full bg-blue-600/5 rounded-xl border border-slate-100">
                                            <div className="flex flex-col gap-1">
                                                <Label className="text-xs text-blue-900">Podas de ventilação</Label>
                                                <p>Realizar podas para melhorar ventilação e iluminação</p>
                                            </div>
                                        </div>
                                        {/* Card */}
                                        <div className="flex flex-col gap-4 p-4 w-full bg-green-600/5 rounded-xl border border-slate-100">
                                            <div className="flex flex-col gap-1">
                                                <Label className="text-xs text-green-900">Monitoramento contínuo</Label>
                                                <p>Agende novas fotos do mesmo pé e intensifique as inspeções</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    )
}