'use client'

import { useState } from "react"
import { Header } from "@/components/layout/app/Header"
import { DataTable } from "@/components/layout/app/DataTable"
import { DialogUploadImagesForAnalysis } from "@/components/layout/app/DialogUploadImagesForAnalysis"

export default function Page() {
    // muda a cada upload concluído: a nova "key" recria a tabela na 1ª página
    const [tableKey, setTableKey] = useState(0)

    return (
        <>
        <Header />
        <div className="flex flex-col p-8 w-full h-full gap-6 overflow-y-scroll">
            <DialogUploadImagesForAnalysis onUploaded={() => setTableKey((key) => key + 1)} />
            <DataTable key={tableKey} />
        </div>
        </>
    )
}