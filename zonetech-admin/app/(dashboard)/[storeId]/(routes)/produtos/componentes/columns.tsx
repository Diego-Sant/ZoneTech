"use client"
// Marcado como componente do cliente

import { ColumnDef } from "@tanstack/react-table"

import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button";
import { CellAction } from "./cellAction";

export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  brands: string;
  category: string;
  colors: string;
  isFeatured: boolean;
  isArchiverd: boolean;
  createdAt: string
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Produto
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "isFeatured",
    header: "Disponível",
    cell: ({ row }) => {
      const dotColor = row.original.isFeatured ? "green" : "red";
      return (
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: dotColor,
            marginLeft: "25px",
            marginRight: "auto",
          }}
        ></div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Preço",
  },
  {
    accessorKey: "category",
    header: "Categoria",
  },
  {
    accessorKey: "brands",
    header: "Marca",
  },
  {
    accessorKey: "colors",
    header: "Cor",
  },
  {
    accessorKey: "createdAt",
    header: "Data e horário",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  }
]
