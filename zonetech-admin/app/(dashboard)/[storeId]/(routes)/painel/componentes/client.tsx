"use client";
import { DataTable } from "@/components/ui/dataTable";
// Marcado como componente do cliente

import { BillboardColumn, columns } from "./columns";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/apiList";

import { Plus } from "lucide-react";

import { useParams, useRouter } from "next/navigation";

interface BillboardClientProps {
    data: BillboardColumn[]
}

export const BillboardClient: React.FC<BillboardClientProps> = ({ data }) => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex flex-col md:flex-row items-center md:justify-between">
                <Heading title={`Painéis publicitários (${data.length})`} description="Gerencie seus painéis para sua loja!"/>
                <Button onClick={() => router.push(`/${params.storeId}/painel/novo`)} className="mt-4 md:mt-0">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar painel
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} />
            <Heading title="Lista de APIs" description="APIs usadas na chamada dos painéis" />
            <Separator />
            <ApiList entityName="painel" entityIdName="Id do painel" />
        </>
    )
}