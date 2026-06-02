"use client"

import { useEffect, useState, } from "react"
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef, } from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, RefreshCcwIcon, ChevronRightIcon, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { SheetDetailsAnalysis } from "./SheetDetailsAnalysis"
import { getAllAnalysis } from "@/services/getAllAnalysis"
import { AnalysisDetails } from "@/services/AnalysisDetails"
import { setTimeout } from "timers"
import { DataAnalysis } from "@/services/AnalysisDetails"

// Definição simples das colunas
const columns: ColumnDef<any>[] = [
    {
        accessorKey: "id",
        header: "Id",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
            const value = getValue<string>()
            return <p className="capitalize">{value}</p>
        }
    },
    {
        accessorKey: "imagesCount",
        header: "Imagens",
    },
    {
        accessorKey: "classe",
        header: "Doença",
        cell: ({ getValue }) => {
            const value = getValue<string>()

            return value === "1" ?
                <Badge variant="destructive"> <AlertCircle />Detectado </Badge>
                :
                <Badge variant="outline"><CheckCircle2 className="text-green-400" /> Não detectado</Badge>
        }
    },
    {
        accessorKey: "confianca",
        header: "Confiança",
    },
    {
        accessorKey: "createdAt",
        header: "Data",
    },
    {
        id: "acoes", // Boa prática. Para o TanStack Table não se perder na renderização e no controle de estado.
        header: "", // Título vazio, apenas para ter mais uma coluna 
        cell: () => (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger className="cursor-pointer border border-chart-1 rounded-sm hover:bg-chart-1/40 transition-colors"> <ChevronRightIcon className="w-5 h-5" /> </TooltipTrigger>
                    <TooltipContent side="left">Ver detalhes</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }
]

export function DataTable() {
    const [data, setData] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [analysisDetails, setAnalysisDetails] = useState<DataAnalysis>()
    const [pagination, setPagination] = useState({ // Controla índice da página
        pageIndex: 0,
        pageSize: 20, // Elementos fixos por tela
    })

    const loadData = async () => {
        setIsLoading(true)

        try {
            const response = await getAllAnalysis(pagination.pageIndex > 0 ? pagination.pageIndex : 1)
            if (!response.success) return

            let filterResponse
            // Filtrando os dados da API para melhor exibição no front
            filterResponse = response.data.map(item => {
                return {
                    idAnalysis: item.id, // Para AnalysisDetails
                    id: item.id.slice(0, 4),
                    status: item.status,
                    imagesCount: item.imagesCount.toString(),
                    createdAt: (item.createdAt).slice(0, 10).replace(/(\d{4})-(\d{2})-(\d{2})/, '$3/$2/$1'),
                    confianca: `${(item.classificacao.confianca * 100).toString()}%` || "indeterminado",
                    pathImages: [],
                    classe: item.classificacao.classe,
                }
            })
            // Salvando dados pegos da API
            setData(filterResponse || [])
        } catch (error) {
            console.error("Erro ao buscar dados da API:", error)
        } finally {
        }

        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 3000)

        clearTimeout(timer)
    }

    const OpenAnalysisDetails = async (idAnalysis: string) => {
        const response = await AnalysisDetails(idAnalysis)
        if (!response.success) return

        const res = response.data

        if (response.success) {
            setAnalysisDetails({
                id: res.id,
                status: res.status,
                createdAt: res.createdAt,
                classificacao: {
                    confianca: res.classificacao.confianca,
                    tempo_execucao: res.classificacao.tempo_execucao,
                    classe: res.classificacao.classe,
                    modelo_cnn: res.classificacao.modelo_cnn,
                },
                actionPlan: { // Em desenvolvimento
                    sumary: "",
                    recommendedActions: ""
                },
                images: res.images,
            })
            setIsOpen(true)
        }
    }

    useEffect(() => { loadData() }, [pagination.pageIndex]) // Buscar os dados da API ao montar o componente ou trocar index da pg

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
        <>
            <SheetDetailsAnalysis isOpen={isOpen} onOpenChange={setIsOpen} data={analysisDetails} />
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
                                    <TableRow className="bg-primary-foreground select-none" onClick={() => OpenAnalysisDetails(row.original.idAnalysis)} key={row.id} >
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


            </div>
        </>
    )
}