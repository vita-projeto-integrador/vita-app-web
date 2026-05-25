import { cn } from "@/lib/utils"

interface Data {
    title: String,
    subtitle: string,
    className?: string,
}

export const HeadlineSection = ({title, subtitle ,className, ...Props} : Data) => {
    return (
        <>
            <div className="flex flex-col items-center">
                <h2 className={cn("max-w-200 mb-2 text-5xl text-slate-700 text-center font-medium font-lexend ", className)}>{title}</h2>
                <p className={cn("mb-15 text-slate-600 text-lg text-center", className)}>{subtitle}</p>
            </div>
        </>
    )
}