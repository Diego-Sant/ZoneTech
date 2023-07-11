"use client";
import { DataTable } from "@/components/ui/dataTable";
// Marcado como componente do cliente

import { BrandColumn, columns } from "./columns";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/apiList";

import { Plus } from "lucide-react";

import { useParams, useRouter } from "next/navigation";

interface BrandClientProps {
    data: BrandColumn[]
}

export const BrandClient: React.FC<BrandClientProps> = ({ data }) => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex flex-col md:flex-row md:justify-between">
                <Heading title={`Marcas (${data.length})`} description="Gerencie as marcas parceiras da sua loja!"/>
                <Button onClick={() => router.push(`/${params.storeId}/marca/novo`)} className="mt-4 md:mt-0">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar marca
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data} />
            <Heading title="Lista de APIs" description="APIs usadas na chamada das marcas" />
            <Separator />
            <ApiList entityName="marca" entityIdName="Id da marca" />
        </>
    )
}