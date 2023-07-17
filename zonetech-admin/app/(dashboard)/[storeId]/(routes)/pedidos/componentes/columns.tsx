"use client"
// Marcado como componente do cliente

import { ColumnDef } from "@tanstack/react-table"

import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button";

export type OrderColumn = {
  id: string;
  phone: string;
  address: string;
  isPaid: boolean;
  totalPrice: string;
  products: string;
  createdAt: string
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Produtos
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "phone",
    header: "Contato",
  },
  {
    accessorKey: "address",
    header: "Endereço",
  },
  {
    accessorKey: "totalPrice",
    header: "Valor total",
  },
  {
    accessorKey: "isPaid",
    header: "Pago",
    cell: ({ row }) => {
      const dotColor = row.original.isPaid ? "green" : "red";
      return (
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: dotColor,
            marginLeft: "13px",
            marginRight: "auto",
          }}
        ></div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Data e horário",
  }
]
