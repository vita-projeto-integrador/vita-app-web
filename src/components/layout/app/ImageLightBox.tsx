import { Dialog, DialogContent, DialogTitle, } from "@/components/ui/dialog"
import Image from "next/image"
import { Dispatch, SetStateAction } from "react"

type Props = {
    path: string,
    isOpen: boolean
    onOpenChange: Dispatch<SetStateAction<boolean>>
}

export const ImageLightBox = ({ path, isOpen = false, onOpenChange }: Props) => {

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="absolute flex flex-col select-none w-full max-w-150 aspect-square" aria-describedby={undefined}>
                    <DialogTitle>Imagem</DialogTitle>

                    <div className="relative h-full w-full p-6">
                        <Image
                            src={path}
                            fill
                            alt="Imagem tela cheia"
                            quality={100}
                            className="rounded-lg"
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}