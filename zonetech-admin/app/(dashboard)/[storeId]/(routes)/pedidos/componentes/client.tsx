"use client";
// Marcado como componente do cliente

import { OrderColumn, columns } from "./columns";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/dataTable";

import { useParams, useRouter } from "next/navigation";

interface OrderClientProps {
    data: OrderColumn[]
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <Heading title={`Pedidos (${data.length})`} description="Verifique os pedidos feitos na sua loja!"/>
            <Separator />
            <DataTable searchKey="products" columns={columns} data={data} />
        </>
    )
}