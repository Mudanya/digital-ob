import { SidebarMenu } from "@/types";
import { ArrowUp, BookCopy, Calendar1, Check, DoorOpen, FileDown, Hammer, PersonStandingIcon, Settings, Timer, TrafficCone, TriangleAlert } from "lucide-react";
import { DashCardItem } from "@/types";

export const Items: SidebarMenu[] = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Timer,
    },
    {
        title: "OB Entries",
        url: "/ob-entries",
        icon: DoorOpen,
    },
    {
        title: "Case Management",
        url: "/case-mgt",
        icon: BookCopy,
    },
    {
        title: "Traffic Offenses",
        url: "/traffic",
        icon: TrafficCone,
    },
    {
        title: "Officers",
        url: "/officers",
        icon: PersonStandingIcon,
    },
    {
        title: "Court cases",
        url: "/cases",
        icon: Hammer,
    },
    {
        title: "Reports",
        url: "/reports",
        icon: FileDown,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
];

export const CardItems:DashCardItem[] = [
    {
      title: "Total Cases",
      value: 2456,
      description: "+12% from last month",
      isPositiveDesc: true,
      DescIcon: ArrowUp,
      descClassName: "text-green-500",
      rightColorBg: "bg-blue-300",
    },
    {
      title: "Pending Cases",
      value: 156,
      description: "23 urgent",
      isPositiveDesc: false,
      DescIcon: TriangleAlert,
      descClassName: "text-orange-500",
      rightColorBg: "bg-orange-300",
    },
    {
      title: "Officers Active",
      value: 24,
      description: "All shifts covered",
      isPositiveDesc: true,
      DescIcon: Check,
      descClassName: "text-green-500",
      rightColorBg: "bg-green-300",
    },
    {
      title: "Court Cases",
      value: 89,
      description: "15 this week",
      isPositiveDesc: true,
      DescIcon: Calendar1,
      descClassName: "text-blue-500",
      rightColorBg: "bg-purple-300",
    },
  ];