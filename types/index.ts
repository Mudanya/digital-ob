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