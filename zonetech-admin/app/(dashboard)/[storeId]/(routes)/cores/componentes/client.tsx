"use client";
import { DataTable } from "@/components/ui/dataTable";
// Marcado como componente do cliente

import { ColorColumn, columns } from "./columns";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/apiList";

import { Plus } from "lucide-react";

import { useParams, useRouter } from "next/navigation";

interface ColorClientProps {
    data: ColorColumn[]
}

export const ColorClient: React.FC<ColorClientProps> = ({ data }) => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex flex-col md:flex-row md:justify-between">
                <Heading title={`Cores (${data.length})`} description="Gerencie as cores disponíveis dos produtos!"/>
                <Button onClick={() => router.push(`/${params.storeId}/cores/novo`)} className="mt-4 md:mt-0">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar cor
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data} />
            <Heading title="Lista de APIs" description="APIs usadas na chamada das cores" />
            <Separator />
            <ApiList entityName="cores" entityIdName="Id da cor" />
        </>
    )
}