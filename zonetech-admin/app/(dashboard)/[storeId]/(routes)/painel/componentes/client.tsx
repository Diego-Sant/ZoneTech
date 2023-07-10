"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { Plus } from "lucide-react";

import { useParams, useRouter } from "next/navigation";

export const BillboardClient = () => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex flex-col md:flex-row items-center md:justify-between">
                <Heading title="Painéis publicitários (0)" description="Gerencie seus painéis para sua loja!"/>
                <Button onClick={() => router.push(`/${params.storeId}/painel/novo`)} className="mt-4 md:mt-0">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar painel
                </Button>
            </div>
            <Separator />
        </>
    )
}