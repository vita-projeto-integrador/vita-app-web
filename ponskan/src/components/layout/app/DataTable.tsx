"use client"

import { useEffect, useState, } from "react"
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef, } from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, RefreshCcwIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { getAllAnalysis } from "@/services/getAllAnalysis"

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
        accessorKey: "tempo_execucao",
        header: "Tempo de execução",
    },
    {
        accessorKey: "createdAt",
        header: "Data",
    },
]

export function DataTable() {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

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
                        id: item.id.slice(0, 4),
                        status: item.status,
                        imagesCount: item.imagesCount.toString(),
                        confianca: `${(item.classificacao.confianca * 100).toString()}%` || "indeterminado",
                        classe: item.classificacao.classe == "true" ? "Detectado" : "Não detectado",
                        tempo_execucao: `${(item.classificacao.tempo_execucao / 1000).toFixed(2)} sec`,
                        createdAt: (item.classificacao.createdAt).slice(0,10).replace(/(\d{4})-(\d{2})-(\d{2})/, '$3/$2/$1')
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

    useEffect(() => { carregarDadosDaAPI() }, [pagination.pageIndex]) // Buscar os dados da API ao montar o componente

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
                                <TableRow className="bg-primary-foreground" key={row.id}>
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
        </div>
    )
}