'use client'

import { Header } from "@/components/layout/app/Header"
import { DataTable } from "@/components/layout/app/DataTable"
import { DialogUploadImagesForAnalysis } from "@/components/layout/app/DialogUploadImagesForAnalysis"

export default function Page() {

    return (
        <>
        <Header />

        <div className="flex flex-col p-8 w-full h-full gap-6 overflow-y-scroll">
            <DialogUploadImagesForAnalysis />
            <DataTable />
        </div>
        </>
    )
}