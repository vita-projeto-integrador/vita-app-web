'use client'
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogHeader, DialogDescription, } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useEffect, useMemo, useState, type ChangeEvent } from "react"
import { ArrowUpFromLine, SearchIcon, TrashIcon } from "lucide-react"
import { createAnalysis } from "@/services/analysis"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { UPLOAD_RULES } from "@/lib/analysis"

const { minImages, maxImages, maxBytes, accept } = UPLOAD_RULES

interface Props {
    onUploaded?: () => void // a página recarrega a tabela
}

export const DialogUploadImagesForAnalysis = ({ onUploaded }: Props) => {
    const [isOpen, setIsOpen] = useState(false)
    const [images, setImages] = useState<File[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState("")

    // prévias: uma URL por arquivo, liberada quando a lista muda ou o dialog fecha
    const previews = useMemo(() => images.map((file) => URL.createObjectURL(file)), [images])
    useEffect(() => () => previews.forEach((url) => URL.revokeObjectURL(url)), [previews])

    const keepFiles = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? [...e.target.files] : []
        e.target.value = "" // permite escolher o mesmo arquivo de novo

        // mesmas regras da API: tipo, tamanho e quantidade
        const invalidType = files.find((file) => !accept.includes(file.type))
        if (invalidType) return setMessage(`${invalidType.name}: use JPG, PNG ou WEBP`)

        const tooBig = files.find((file) => file.size > maxBytes)
        if (tooBig) return setMessage(`${tooBig.name}: o limite é 5 MB por imagem`)

        if (images.length + files.length > maxImages) return setMessage(`Escolha no máximo ${maxImages} imagens`)

        setMessage("")
        setImages((prev) => [...prev, ...files])
    }

    const submitFiles = async () => {
        if (images.length < minImages) return setMessage("Escolha ao menos uma imagem")

        const formData = new FormData()
        images.forEach((file) => formData.append("images", file)) // campo "images" da API

        setIsSubmitting(true)
        const response = await createAnalysis(formData)
        setIsSubmitting(false)

        if (!response.success) return setMessage(response.message)

        onUploaded?.() // 202: a análise entra na fila e aparece na tabela como "Na fila"
        closeDialog()
    }

    const closeDialog = () => {
        setImages([])
        setMessage("")
        setIsOpen(false)
    }

    const deleteImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index))
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => (open ? setIsOpen(true) : closeDialog())}>
            <DialogTrigger className="w-fit" asChild>
                <Button><ArrowUpFromLine />Enviar imagens para análise</Button>
            </DialogTrigger>

            <DialogContent className="overflow-hidden select-none">
                <ProgressBar range={maxImages} stage={images.length} />

                <DialogHeader>
                    <DialogTitle>Fazer upload de imagens</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Envie de 1 a 4 imagens do mesmo fruto ou folha. Para um resultado melhor, use 4 posições diferentes.
                </DialogDescription>

                <div className="w-full h-fit flex flex-col items-center gap-4 p-6 border-2 border-dashed border-chart-1 rounded-lg bg-slate-50 ">
                    <Button asChild className="flex" variant={images.length < maxImages ? "default" : "ghost"}>
                        <label htmlFor="file1" className="gap-3" >
                            <SearchIcon className="w-5" />Procurar neste computador
                        </label>
                    </Button>

                    <input onChange={keepFiles} multiple type="file" accept={accept.join(",")} name="file1" id="file1" className="hidden" disabled={images.length >= maxImages} />
                    <p className="text-chart-3 text-center">JPG, PNG ou WEBP. Máx. 5 MB por imagem.</p>
                </div>

                <div className="w-full h-20 flex justify-between gap-2">
                    {
                        Array.from({ length: maxImages }, (_, i) => (
                            <div key={i} className={`w-20 h-20 relative rounded-lg overflow-hidden bg-slate-200 ${images[i] !== undefined && "active:scale-95 group"}`}>
                                {
                                    images[i] !== undefined && ( // Botão de excluir a imagem
                                        <button onClick={() => deleteImage(i)} className="p-1 absolute flex flex-col justify-center items-center w-5 h-5 right-2 top-2 bg-foreground/55 text-white cursor-pointer rounded-md transition-all z-10 group-hover:w-20 group-hover:h-20 group-hover:top-0 group-hover:right-0">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    )
                                }
                                {/* blob: local, não passa pelo next/image */}
                                {previews[i] && <img src={previews[i]} alt="" className="absolute inset-0 h-full w-full object-cover" />}
                            </div>
                        ))
                    }
                </div>

                {message && <p className="text-sm text-destructive text-center">{message}</p>}

                <Button
                    variant={images.length >= minImages && !isSubmitting ? "default" : "ghost"}
                    disabled={images.length < minImages || isSubmitting}
                    onClick={submitFiles}
                >
                    {isSubmitting ? "Enviando..." : "Enviar para análise"}
                </Button>
            </DialogContent>
        </Dialog>
    )
}