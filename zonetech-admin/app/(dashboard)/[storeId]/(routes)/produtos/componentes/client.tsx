"use client";
import { DataTable } from "@/components/ui/dataTable";
// Marcado como componente do cliente

import { ProductColumn, columns } from "./columns";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/apiList";

import { Plus } from "lucide-react";

import { useParams, useRouter } from "next/navigation";

interface ProductClientProps {
    data: ProductColumn[]
}

export const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex flex-col md:flex-row md:justify-between">
                <Heading title={`Produtos (${data.length})`} description="Gerencie os produtos disponíveis!"/>
                <Button onClick={() => router.push(`/${params.storeId}/produtos/novo`)} className="mt-4 md:mt-0">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar produto
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data} />
            <Heading title="Lista de APIs" description="APIs usadas na chamada dos produtos" />
            <Separator />
            <ApiList entityName="produtos" entityIdName="Id do produto" />
        </>
    )
}