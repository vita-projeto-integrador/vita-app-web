"use client"

import { useEffect, useState, } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef, } from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, RefreshCcwIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { getAllAnalysis } from "@/services/getAllAnalysis"
import { getOneAnalysis } from "@/services/getOneAnalysis"

interface AnalysisDetails {
    idAnalysis: string
    statusAnalysis: string
    createAt: string
    tempoExecucao: number
    doenca: "Detectado" | "Não detectado"
    confianca: number
    modeloCnn: string
}

// 1. Definição simples das colunas (Exemplo com ID e Título)
const columns: ColumnDef<any>[] = [
    {
        accessorKey: "id",
        header: "Id",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "imagesCount",
        header: "Imagens",
    },
    {
        accessorKey: "classe",
        header: "Doença",
    },
    {
        accessorKey: "confianca",
        header: "Confiança",
    },
    {
        accessorKey: "createdAt",
        header: "Data",
    },
]

export function DataTable() {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [sheetIsOpen, setSheetIsOpen] = useState(false)
    const [analysisDetails, setAnalysisDetails] = useState<AnalysisDetails>()

    // Estado apenas para controlar o índice da página (começa na 0)
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20, // <--- NÚMERO FIXO DE ELEMENTOS POR TELA
    })


    const carregarDadosDaAPI = async () => {
        try {
            const response = await getAllAnalysis(pagination.pageIndex > 0 ? pagination.pageIndex : 1)

            let filterResponse
            // Filtrando os dados da API para melhor exibição no front
            if (response.success) {
                filterResponse = response.data.map(item => {
                    return {
                        idAnalysis: item.id, // Para getOneAnalysis
                        id: item.id.slice(0, 4),
                        status: item.status,
                        imagesCount: item.imagesCount.toString(),
                        confianca: `${(item.classificacao.confianca * 100).toString()}%` || "indeterminado",
                        classe: item.classificacao.classe,
                        // tempo_execucao: `${(item.classificacao.tempo_execucao / 1000).toFixed(2)} sec`,
                        createdAt: (item.classificacao.createdAt).slice(0, 10).replace(/(\d{4})-(\d{2})-(\d{2})/, '$3/$2/$1')
                    }
                })
            }

            // Salvando dados pegos da API
            setData(filterResponse || [])
        } catch (error) {
            console.error("Erro ao buscar dados da API:", error)
        } finally {
            setLoading(false)
        }
    }

    const OpenAnalysisDetails = async (idAnalysis: string) => {
        const response = await getOneAnalysis(idAnalysis)

        if (response.success) {
            setAnalysisDetails({
                idAnalysis: response?.data.analysis.id,
                statusAnalysis: response?.data.analysis.status,
                confianca: response?.data.classification[0].confianca,
                tempoExecucao: response?.data.classification[0].tempo_execucao,
                createAt: response?.data.classification[0].createdAt,
                doenca: response?.data.classification[0].classe == "true" ? "Detectado" : "Não detectado",
                modeloCnn: response?.data.classification[0].modelo_cnn
            })
        }

        setSheetIsOpen(true)
    }

    useEffect(() => { carregarDadosDaAPI() }, [pagination.pageIndex]) // Buscar os dados da API ao montar o componente ou trocar index da pg

    const table = useReactTable({
        data,
        columns,
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true
    })

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* 2. Renderização da Tabela */}
            <div className="rounded-md border overflow-hidden">
                <Table className="">
                    <TableHeader >
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow className="bg-muted" key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead className="text-muted-foreground" key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow className="bg-primary-foreground cursor-pointer" onClick={() => OpenAnalysisDetails(row.original.idAnalysis)} key={row.id} >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Nenhum resultado encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* 3. Controles Simples de Paginação */}
            <div className="flex items-center justify-end gap-4 px-2">
                <div className="flex-1">
                    <Button variant="outline" onClick={carregarDadosDaAPI}><RefreshCcwIcon /> Atualizar</Button>
                </div>
                <div className="text-sm font-medium">
                    Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                </div>
                <div className="flex items-center gap-2">
                    <Button // Botão de voltar página
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className="size-4" />
                    </Button>
                    <Button // Botão de avançar página
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
            </div>

            <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
                <SheetContent className="select-none">
                    <SheetHeader>
                        <SheetTitle>Detalhes</SheetTitle>
                        <SheetDescription>Mais informações sobre a análise</SheetDescription>
                    </SheetHeader>

                    <div className="flex flex-col p-4 gap-4 w-full h-full bg-slate-50">
                        <div className="flex flex-col gap-4 p-4 bg-white rounded-xl border border-slate-100">
                            <div className="flex items-center border-b border-slate-100 pb-3">
                                <div className="flex flex-col gap-1">
                                    <Label className="text-xs text-muted-foreground">Id da análise</Label>
                                    <p className="text-sm font-mono font-medium text-slate-700">{analysisDetails?.idAnalysis}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <Label className="text-xs text-muted-foreground">Status</Label>
                                    <span className="text-sm font-semibold text-slate-800 capitalize">
                                        {analysisDetails?.statusAnalysis}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <Label className="text-xs text-muted-foreground">Data da Análise</Label>
                                    <span className="text-sm text-slate-600">
                                        {analysisDetails?.createAt ? new Date(analysisDetails.createAt).toLocaleDateString('pt-BR') : '---'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 p-4 bg-white rounded-xl border border-slate-100">
                            <div className="border-b border-slate-100 pb-2">
                                <h4 className="text-sm font-semibold text-slate-900">Resultado do Modelo Visão Computacional</h4>
                            </div>

                            <div className={`p-3 rounded-lg flex flex-col gap-1 border ${analysisDetails?.doenca === "Detectado"
                                    ? "bg-red-50 border-red-200 text-red-900"
                                    : "bg-green-50 border-green-200 text-green-900"
                                }`}>
                                <Label className="text-xs opacity-80">Diagnóstico de Pinta Preta</Label>
                                <span className="text-lg font-bold flex items-center gap-1.5">
                                    {analysisDetails?.doenca === "Detectado" ? "Pinta Preta Detectada" : "Fruta Saudável"}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="flex flex-col gap-1">
                                    <Label className="text-xs text-muted-foreground">Confiança do Modelo</Label>
                                    <span className="text-sm font-semibold text-slate-800">
                                        {analysisDetails?.confianca ? `${(analysisDetails.confianca * 100).toFixed(2)}%` : '---'}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <Label className="text-xs text-muted-foreground">Tempo de Execução</Label>
                                    <span className="text-sm font-medium text-slate-600">
                                        {analysisDetails?.tempoExecucao ? `${analysisDetails.tempoExecucao} ms` : '---'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 border-t border-slate-100 pt-3">
                                <Label className="text-xs text-muted-foreground">Rede Neural Utilizada (CNN)</Label>
                                <span className="text-xs font-mono text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 mt-1">
                                    {analysisDetails?.modeloCnn || 'Não especificado'}
                                </span>
                            </div>
                        </div>

                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}