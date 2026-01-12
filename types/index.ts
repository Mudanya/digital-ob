import { LucideIcon } from "lucide-react"
import { Icon } from "next/dist/lib/metadata/types/metadata-types"

export type DashCardItem =
    {
        title: string,
        value: number,
        description: string,
        isPositiveDesc: boolean,
        DescIcon: LucideIcon,
        descClassName?: string,
        rightColorBg?: string,
    }
export type SidebarMenu = {
    title: string,
    url: string
    icon: LucideIcon,
}

export type ObEntry = {
    id: number,
    obNumber: string,
    dateTime: string,
    description: string,
    officer: string,
    priority: string,
}