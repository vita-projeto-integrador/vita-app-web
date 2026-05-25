import { forwardRef, InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    textLabel: string
    error?: string,
    inputId: string, 
    visible: boolean
}

export const InputText = forwardRef<HTMLInputElement, Props>(({ textLabel, error, inputId, visible, ...props }, ref) => {
    return (
        <div className={`flex flex-col h-16 w-full gap-2 mb-4 ${visible ? "visible" : "hidden"}`}>
            <div className=" relative h-fit w-full ">
                <input id={inputId} ref={ref} {...props} placeholder=" " className={` peer px-3 w-full h-12 text-slate-600 rounded-xl border focus:border-amber-400 hover:border-amber-300 transition-colors outline-none ${!error ? "border-slate-300" : "border-red-500"}`} /> 
                <label htmlFor={inputId} className="absolute text-md text-slate-500 px-2 left-3 top-3 bg-slate-50 peer-focus:-top-2 peer-focus:text-amber-400 peer-focus:text-xs peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-amber-400 peer-not-placeholder-shown:text-xs transition-all">{textLabel}</label>
            </div>

            {/* Exibição condicional de erro */}
            {error && (
                <span className="text-xs text-right w-full text-red-500">
                    {error}
                </span>
            )}
        </div>
    )
})