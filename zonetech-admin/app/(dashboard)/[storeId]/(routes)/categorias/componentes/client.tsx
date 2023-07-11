"use client";
import { DataTable } from "@/components/ui/dataTable";
// Marcado como componente do cliente

import { CategoryColumn, columns } from "./columns";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/apiList";

import { Plus } from "lucide-react";

import { useParams, useRouter } from "next/navigation";

interface CategoryClientProps {
    data: CategoryColumn[]
}

export const CategoryClient: React.FC<CategoryClientProps> = ({ data }) => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex flex-col md:flex-row md:justify-between">
                <Heading title={`Categorias (${data.length})`} description="Gerencie as categorias da sua loja!"/>
                <Button onClick={() => router.push(`/${params.storeId}/categorias/novo`)} className="mt-4 md:mt-0">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar categoria
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data} />
            <Heading title="Lista de APIs" description="APIs usadas na chamada das categorias" />
            <Separator />
            <ApiList entityName="categorias" entityIdName="Id da categoria" />
        </>
    )
}