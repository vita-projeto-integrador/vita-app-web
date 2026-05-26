"use client"

import { useEffect, useState, } from "react"
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef, } from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, RefreshCcwIcon, } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SheetDetailsAnalysis } from "./SheetDetailsAnalysis"
import { getAllAnalysis } from "@/services/getAllAnalysis"
import { getOneAnalysis } from "@/services/getOneAnalysis"
import { setTimeout } from "timers"
import { DataAnalysis } from "./SheetDetailsAnalysis"

// Definição simples das colunas
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
        cell: ({ getValue }) => {
            const classe = getValue<string>()

            return classe === "true" ?  <Badge variant="destructive">Detectado</Badge> : <Badge variant="outline">Não detectado</Badge> 
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
            filterResponse = response.data.map(item => {
                return {
                    idAnalysis: item.id, // Para getOneAnalysis
                    id: item.id.slice(0, 4),
                    status: item.status,
                    imagesCount: item.imagesCount.toString(),
                    confianca: `${(item.classificacao.confianca * 100).toString()}%` || "indeterminado",
                    classe: item.classificacao.classe,
                    createdAt: (item.classificacao.createdAt).slice(0, 10).replace(/(\d{4})-(\d{2})-(\d{2})/, '$3/$2/$1')
                }
            })


            // Filtrando os dados da API para melhor exibição no front

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
        const response = await getOneAnalysis(idAnalysis)

        if (response.success) {
            setAnalysisDetails({
                id: response?.data.analysis.id,
                status: response?.data.analysis.status,
                assurance: response?.data.classification[0].confianca,
                timeExec: response?.data.classification[0].tempo_execucao,
                createAt: response?.data.classification[0].createdAt,
                class: response?.data.classification[0].classe == "true" ? "Detectado" : "Não detectado",
                modelCNN: response?.data.classification[0].modelo_cnn,
                actionPlan: { // Em desenvolvimento
                    sumary: "",
                    recommendedActions: ""
                }
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
                        <Button variant="outline" onClick={loadData}><RefreshCcwIcon /> {isLoading ? "Carregando..." : "Atualizar"} </Button>
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


            </div>
        </>
    )
}