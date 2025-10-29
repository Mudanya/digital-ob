import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SelectGroup, SelectLabel } from "@/components/ui/select";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { PlusCircle, Badge, Eye, Edit, Printer } from "lucide-react";

const entries = [
  {
    obNumber: "OB/2024/001567",
    dateTime: "12 Oct 2024, 14:30",
    description: "Armed Robbery - Westlands Area",
    officer: "PC Mary Wanjiku",
    priority: "urgent",
  },
  {
    obNumber: "OB/2024/001566",
    dateTime: "12 Oct 2024, 10:15",
    description: "Traffic Accident - Uhuru Highway",
    officer: "Cpl James Ochieng",
    priority: "high",
  },
  {
    obNumber: "OB/2024/001565",
    dateTime: "12 Oct 2024, 08:45",
    description: "Lost Document Report",
    officer: "PC Grace Muthoni",
    priority: "medium",
  },
  {
    obNumber: "OB/2024/001564",
    dateTime: "11 Oct 2024, 22:30",
    description: "Domestic Disturbance - Kilimani",
    officer: "PC Mary Wanjiku",
    priority: "low",
  },
  {
    obNumber: "OB/2024/001563",
    dateTime: "11 Oct 2024, 19:00",
    description: "Theft of Mobile Phone - CBD",
    officer: "Cpl James Ochieng",
    priority: "medium",
  },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "bg-red-500/20 text-red-300 hover:bg-red-500/30";
    case "high":
      return "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30";
    case "medium":
      return "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30";
    case "low":
      return "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30";
    default:
      return "bg-gray-500/20 text-gray-300 hover:bg-gray-500/30";
  }
};
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-blue-200">Date Range</label>
            <Input
              type="date"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-blue-200">Priority</label>
            <Select>
              <SelectTrigger className="bg-white/10 w-full rounded-lg p-2 border-white/20 text-white">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent className="bg-white/12 w-full">
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
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
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
          <div className="flex flex-col gap-2">
            <label className="text-sm text-blue-200">Officer</label>
            <Select>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="All Officers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Officers</SelectItem>
                <SelectItem value="mary">PC Mary Wanjiku</SelectItem>
                <SelectItem value="james">Cpl James Ochieng</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Entries Table */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-semibold text-blue-200">
                  OB Number
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-blue-200">
                  Date & Time
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-blue-200">
                  Description
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-blue-200">
                  Officer
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-blue-200">
                  Priority
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-blue-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr
                  key={index}
                  className="border-t border-white/10 hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-4 font-semibold text-blue-400">
                    {entry.obNumber}
                  </td>
                  <td className="px-4 py-4 text-white">{entry.dateTime}</td>
                  <td className="px-4 py-4 text-white">{entry.description}</td>
                  <td className="px-4 py-4 text-white">{entry.officer}</td>
                  <td className="px-4 py-4">
                    <Badge className={getPriorityColor(entry.priority)}>
                      {entry.priority.charAt(0).toUpperCase() +
                        entry.priority.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="bg-white/10 hover:bg-white/20 text-white"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="bg-white/10 hover:bg-white/20 text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="bg-white/10 hover:bg-white/20 text-white"
                      >
                        <Printer className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-white/10">
          <div className="text-sm text-blue-200">
            Showing 1-5 of 1,567 entries
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Previous
            </Button>
            <Button className="bg-blue-700 hover:bg-blue-800 text-white">
              1
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              2
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              3
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </main>
  );
};

export default ObEntries;
