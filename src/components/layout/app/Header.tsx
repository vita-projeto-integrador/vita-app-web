import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { usePathname } from "next/navigation"
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"
import { Calendar, FileText } from "lucide-react"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

const namePage = () => {
  const path = usePathname()
  let pageName

  switch (path){
    case "/app":
      pageName = "Dashboard"
      break
    case "/app/analysis":
      pageName = "Análises"
      break
    case "/app/map":
      pageName = "Mapa"
      break
    default:
      pageName = "Ponskan"
  }

  return pageName
}

type Props = {
  className?: string
}

export const Header = ({className} : Props) => {
  return (
    <header className={`flex h-16 shrink-0 items-center gap-3 border-b p-4 select-none bg-white ${className}`}>
      <SidebarTrigger />
      <Separator orientation="vertical" />
      <h1 className="font-semibold ml-1">{namePage()}</h1>

      <div className="flex flex-1 justify-end gap-4 pr-4">
        <ButtonGroup>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Últimos 7 dias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7day">
                Últimos 7 dias
              </SelectItem>
              <SelectItem value="1month">
                Últimos 30 dias
              </SelectItem>
              <SelectItem value="3month">
                Últimos 90 dias
              </SelectItem>
            </SelectContent>
          </Select>
        </ButtonGroup>
        <Button disabled variant="default"><FileText /> Exportar <span className="hidden md:visible">para PDF</span></Button>
      </div>
    </header>
  )
}