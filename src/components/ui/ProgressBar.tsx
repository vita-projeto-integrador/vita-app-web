import { ComponentPropsWithoutRef } from "react"
import { cn } from "@/lib/utils"

interface Props extends ComponentPropsWithoutRef<'div'>{
    range: number
    stage: number
    className?: string
}

export const ProgressBar = ({range, stage, className, ...props} : Props) => {
    // Verificação se o valor passado por stage está entre 0 e o $range
    const currentStage = Math.min(Math.max(1, stage), range)

    // Cálculo da porcentagem
    const percentage = (currentStage / range) * 100;


    return(
        <div className={cn("flex gap-4 items-center w-full absolute left-0 top-0", className)}>
            <div className={`flex w-full h-1 bg-slate-200 rounded-full transition-all`} {...props}>
                <div style={{width: `${percentage}%`}} className={`h-full rounded-full bg-foreground/80 transition-all`}></div>
            </div>          
        </div>
    )
}