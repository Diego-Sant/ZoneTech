"use client"
// Marcado como componente do cliente

import { ColumnDef } from "@tanstack/react-table"

import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button";
import { CellAction } from "./cellAction";

export type BrandColumn = {
  id: string;
  name: string;
  value: string;
  createdAt: string
}

export const columns: ColumnDef<BrandColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Marca
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "value",
    header: "Ano de fundação",
  },
  {
    accessorKey: "createdAt",
    header: "Quando se juntaram",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  }
]
