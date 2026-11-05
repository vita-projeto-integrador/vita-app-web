"use client"

import { useEffect, useRef, useState } from "react"
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, RefreshCcwIcon, ChevronRightIcon, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { SheetDetailsAnalysis } from "./SheetDetailsAnalysis"
import { getAnalysis, listAnalyses } from "@/services/analysis"
import { STATUS_LABEL, formatConfidence, formatDate, isInProgress } from "@/lib/analysis"
import type { AnalysisDetails, AnalysisListItem } from "@/types/api"

const PAGE_SIZE = 20 // mesmo padrão da API

// As células leem o item da API direto (row.original): sem objeto intermediário
const columns: ColumnDef<AnalysisListItem>[] = [
    {
        id: "id",
        header: "Id",
        cell: ({ row }) => <span className="font-mono">{row.original.id.slice(0, 8)}</span>,
    },
    {
        id: "status",
        header: "Status",
        cell: ({ row }) => STATUS_LABEL[row.original.status],
    },
    {
        accessorKey: "total_imagens",
        header: "Imagens",
    },
    {
        id: "classe",
        header: "Doença",
        cell: ({ row }) => {
            const { status, classificacao } = row.original
            if (status === "falhou") return <Badge variant="secondary">Sem resultado</Badge>
            if (!classificacao) return <Badge variant="secondary">Analisando</Badge>

            return classificacao.classe === "infectado"
                ? <Badge variant="destructive"><AlertCircle />Detectado</Badge>
                : <Badge variant="outline"><CheckCircle2 className="text-green-400" />Não detectado</Badge>
        },
    },
    {
        id: "confianca",
        header: "Confiança",
        cell: ({ row }) => {
            const { classificacao } = row.original
            return classificacao ? formatConfidence(classificacao.confianca) : "—"
        },
    },
    {
        id: "criado_em",
        header: "Data",
        cell: ({ row }) => formatDate(row.original.criado_em),
    },
    {
        id: "acoes", // Boa prática. Para o TanStack Table não se perder na renderização e no controle de estado.
        header: "", // Título vazio, apenas para ter mais uma coluna
        cell: () => (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger className="cursor-pointer border border-chart-1 rounded-sm hover:bg-chart-1/40 transition-colors"> <ChevronRightIcon className="w-5 h-5" /> </TooltipTrigger>
                    <TooltipContent className="select-none" side="left">Ver detalhes</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        ),
    },
]

// Para recarregar do zero (ex.: após upload), o pai troca a "key" do componente
export function DataTable() {
    const [data, setData] = useState<AnalysisListItem[]>([])
    const [pageCount, setPageCount] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [analysisDetails, setAnalysisDetails] = useState<AnalysisDetails>()
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: PAGE_SIZE })

    const lastRequest = useRef(0) // descarta respostas antigas ao trocar de página rápido

    const loadData = async (pageIndex: number) => {
        const requestId = ++lastRequest.current
        setIsLoading(true)
        // pageIndex do TanStack começa em 0; page da API começa em 1
        const response = await listAnalyses(pageIndex + 1, PAGE_SIZE)
        if (requestId !== lastRequest.current) return
        setIsLoading(false)

        if (!response.success) {
            setMessage(response.message)
            return
        }
        setMessage("")
        setData(response.data.items)
        setPageCount(response.data.total_pages)
    }

    useEffect(() => { loadData(pagination.pageIndex) }, [pagination.pageIndex])

    const openDetails = async (item: AnalysisListItem) => {
        if (isInProgress(item.status)) return setMessage("Análise em andamento: atualize em alguns segundos.")
        if (item.status === "falhou") return setMessage("Esta análise falhou e não tem resultado.")

        const response = await getAnalysis(item.id)
        if (!response.success) return setMessage(response.message)

        setAnalysisDetails(response.data)
        setIsOpen(true)
    }

    const table = useReactTable({
        data,
        columns,
        state: { pagination },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount, // total_pages da API: sem isso a tabela calcula pelas linhas carregadas
    })

    return (
        <>
            <SheetDetailsAnalysis isOpen={isOpen} onOpenChange={setIsOpen} data={analysisDetails} />

            <div className="flex flex-col gap-4 w-full">
                <div className="flex items-center gap-4">
                    <Button variant={"outline"} className="w-fit" disabled={isLoading} onClick={() => loadData(pagination.pageIndex)}>
                        <RefreshCcwIcon className={isLoading ? "animate-spin" : ""} />Atualizar
                    </Button>
                    {message && <span className="text-sm text-muted-foreground">{message}</span>}
                </div>

                <div className="rounded-xl border overflow-hidden">
                    <Table>
                        <TableHeader>
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
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        className="bg-primary-foreground select-none cursor-pointer"
                                        onClick={() => openDetails(row.original)}
                                    >
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
                                        {isLoading ? "Carregando..." : "Nenhuma análise encontrada."}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-end gap-4 px-2">
                    <div className="text-sm font-medium">
                        Página {pageCount === 0 ? 0 : pagination.pageIndex + 1} de {pageCount}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="size-8" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage() || isLoading}>
                            <ChevronLeft className="size-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="size-8" onClick={() => table.nextPage()} disabled={!table.getCanNextPage() || isLoading}>
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}