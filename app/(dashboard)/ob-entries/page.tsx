"use client";
import DataTable from "@/components/layouts/data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ObEntry } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, PlusCircle } from "lucide-react";

const entries: ObEntry[] = [
  {
    id: 1,
    obNumber: "OB/2024/001567",
    dateTime: "12 Oct 2024, 14:30",
    description: "Armed Robbery - Westlands Area",
    officer: "PC Mary Wanjiku",
    priority: "urgent",
  },
  {
    id: 2,
    obNumber: "OB/2024/001566",
    dateTime: "12 Oct 2024, 10:15",
    description: "Traffic Accident - Uhuru Highway",
    officer: "Cpl James Ochieng",
    priority: "high",
  },
  {
    id: 3,
    obNumber: "OB/2024/001565",
    dateTime: "12 Oct 2024, 08:45",
    description: "Lost Document Report",
    officer: "PC Grace Muthoni",
    priority: "medium",
  },
  {
    id: 4,
    obNumber: "OB/2024/001564",
    dateTime: "11 Oct 2024, 22:30",
    description: "Domestic Disturbance - Kilimani",
    officer: "PC Mary Wanjiku",
    priority: "low",
  },
  {
    id: 5,
    obNumber: "OB/2024/001563",
    dateTime: "11 Oct 2024, 19:00",
    description: "Theft of Mobile Phone - CBD",
    officer: "Cpl James Ochieng",
    priority: "medium",
  },
];

export const columns: ColumnDef<ObEntry>[] = [
  {
    accessorKey: "obNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          OB Number
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("obNumber")}</div>
    ),
  },
  {
    accessorKey: "dateTime",
    header: "Date & Time",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("dateTime")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "officer",
    header: "Officer",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("officer")}</div>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("priority")}</div>
    ),
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const entry = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(`${entry.id}`)}
            >
              Copy entry ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View entry details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// const getPriorityColor = (priority: string) => {
//   switch (priority) {
//     case "urgent":
//       return "bg-red-500/20 text-red-300 hover:bg-red-500/30";
//     case "high":
//       return "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30";
//     case "medium":
//       return "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30";
//     case "low":
//       return "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30";
//     default:
//       return "bg-gray-500/20 text-gray-300 hover:bg-gray-500/30";
//   }
// };
const ObEntries = () => {
  return (
    <main className="flex-1 p-6 overflow-y-auto h-[calc(100vh-80px)]">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">OB Entries</h2>
          <p className="text-blue-200">
            View and manage all occurrence book entries
          </p>
        </div>
        <Button className="bg-blue-700 hover:bg-blue-800 text-white">
          <PlusCircle className="w-5 h-5 mr-2" />
          New Entry
        </Button>
      </div>

      {/* Filters Card */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-blue-200">Priority</label>
            <Select>
              <SelectTrigger className="bg-white/10 w-full rounded-lg p-2 border-white/20 text-white">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>All Priorities</SelectLabel>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-blue-200">Category</label>
            <Select>
              <SelectTrigger className="bg-white/10 border-white/20 w-full rounded-lg p-2 text-white">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="theft">Theft</SelectItem>
                <SelectItem value="assault">Assault</SelectItem>
                <SelectItem value="traffic">Traffic</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Entries Table */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <DataTable columns={columns} data={entries} />
        </div>

        
      </Card>
    </main> 
  );
};

export default ObEntries;
