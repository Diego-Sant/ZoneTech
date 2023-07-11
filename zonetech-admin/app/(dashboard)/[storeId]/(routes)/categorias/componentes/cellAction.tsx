"use client";
// Marcado como componente do cliente

import { useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { CategoryColumn } from "./columns";
import { DropdownMenuTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { AlertModalTwo } from "@/components/modals/alertModalTwo";

import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";

import { toast } from "react-hot-toast";

import axios from "axios";

interface CellActionProps {
    data: CategoryColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
    const router = useRouter()
    const params = useParams();

    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("ID copiado com sucesso!");
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/categorias/${data.id}`);
            
            router.refresh();
            toast.success("Categoria excluída com sucesso!")
        } catch (error) {
            console.log(error)
            toast.error("Tenha certeza de remover todos os produtos dentro dessa categoria primeiro!")
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModalTwo isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} /> {/* Tive que criar o AlertModalTwo pois o primeiro AlertModal já tinha a mensagem para a exclusão do painel */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span> {/* Acessibilidade */}
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>
                        Ações
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onCopy(data.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copiar ID
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/categorias/${data.id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Atualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)} className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" />
                        Excluir
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}