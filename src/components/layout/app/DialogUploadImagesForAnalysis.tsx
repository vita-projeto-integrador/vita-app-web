'use client'
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogHeader, DialogDescription, } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { ArrowUpFromLine, SearchIcon, TrashIcon } from "lucide-react"
import Image from "next/image"
import { ChangeEvent } from "react"
import { uploapImagesForAnalyse } from "@/services/uploadFileForAnalyse"
import { ProgressBar } from "@/components/ui/ProgressBar"

export const DialogUploadImagesForAnalysis = () => {
    const [isOpen, setIsOpen] = useState(false) // Alterar o comportamento do Dialog
    const maxImages = 3 // => 4
    const [images, setImages] = useState<(File)[]>([])
    const [isSubmiting, setIsSubmiting] = useState(false)
    const imagesToFormData = new FormData()

    const keepFiles = (e: ChangeEvent<HTMLInputElement>) => {
        // Pegar o Filelist e transformar em array de File
        const file = e.target.files ? [...e.target.files] : []

        if (file.length < 1) {
            alert("É necessário escolher imagens")
            return
        }
        // maxImage + 1, pois, images|file .length iniciam a contagem em 1/ maxImage começa em 0
        if ((images.length + file.length) > maxImages + 1) {
            alert("Você selecionou muitas imagens")
            return
        }

        file.map((_, i) => {
            setImages(prev => [...prev, file[i]]) // Pega o ultimo estado e add file
        })

        e.target.value = "" // Limpa valor do input -> não puxar a mesma imagem
    }

    const submitFiles = async () => {
        if (images.length != 4) return alert("Quantidade de imagens inválida")

        setIsSubmiting(true)
        images.map((file) => { // pega as imagens e salva na variavel imagesToFormData / = formData() /
            imagesToFormData.append("images", file)
        })
        const response = await uploapImagesForAnalyse(imagesToFormData) // Função para mandar imgs para análise

        if (response.success) {
            clearFileAndClose()
            setIsSubmiting(false)
        } else {
            setIsSubmiting(false)
            alert(response.message)
        }
    }

    const clearFileAndClose = () => { // Limpar TODA a fila de arquivos
        setImages([])
        setIsOpen(false)
    }

    const deleteImage = (index: number) => {
        const newArrayImage = images.filter((_, i) => i !== index)
        setImages(newArrayImage)
    }

    useEffect(() => { // Limpar a fila de arquivos ao fechar o dialog
        isOpen == false && clearFileAndClose()
    }, [isOpen])

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger className="w-fit" asChild>
                    <Button><ArrowUpFromLine />Enviar imagens para análise</Button>
                </DialogTrigger>

                <DialogContent className="overflow-hidden select-none">
                    <ProgressBar range={maxImages + 1} stage={images.length} />

                    <DialogHeader>
                        <DialogTitle>Fazer upload de imagens</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>Escolha 4 imagens de posições diferentes do mesmo fruto ou folha</DialogDescription>

                    <div className="w-full h-fit flex flex-col items-center gap-4 p-6 border-2 border-dashed border-chart-1 rounded-lg bg-slate-50 ">
                        <Button asChild className="flex" variant={images.length <= maxImages ? "default" : "ghost"}>
                            <label htmlFor="file1" className="gap-3" >
                                <SearchIcon className="w-5" />Procurar neste computador
                            </label>
                        </Button>

                        <input onChange={keepFiles} multiple type="file" accept="image/*" name="file1" id="file1" className="hidden" disabled={images.length <= maxImages ? false : true} />
                        <p className="text-chart-3 text-center">JPG, JPEG, PNG. Max 5mb. </p>
                    </div>

                    <div className="w-full h-20 flex justify-between gap-2">
                        {
                            // Cria um "falso" array com .map embutido para renderizar elementos
                            Array.from({ length: maxImages + 1}, (_, i) => ( 
                                <div key={i} className={`w-20 h-20 relative rounded-lg overflow-hidden bg-slate-200 ${images[i] !== undefined && "active:scale-95 group"}`}>
                                    {
                                        images[i] !== undefined && ( // Botão de exlcuir a imagem
                                            <button onClick={() => deleteImage(i)} className="p-1 absolute flex flex-col justify-center items-center w-5 h-5 right-2 top-2 bg-foreground/55 text-white cursor-pointer rounded-md transition-all z-10 group-hover:w-20 group-hover:h-20 group-hover:top-0 group-hover:right-0">
                                                <TrashIcon className="w-5 h-5"/>
                                            </button>
                                        )
                                    }
                                    { images[i] && <Image fill src={URL.createObjectURL(images[i])} alt="" /> /* Previa das imagens */}
                                </div>
                            ))
                        }
                    </div>
                    {/* <p className="w-full text-center font-thin text-chart-2">Clique para excluir</p> */}
                    <Button
                        variant={images.length - 1 == maxImages && !isSubmiting ? "default" : "ghost"}
                        disabled={images.length < (maxImages + 1) || isSubmiting}
                        onClick={submitFiles}
                    >
                        {isSubmiting ? "Enviando dados" : "Enviar para análise"}
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    )
}