"use client";
// Marcado como componente do cliente

import { useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { ProductColumn } from "./columns";
import { DropdownMenuTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdownMenu";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alertModal";

import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";

import { toast } from "react-hot-toast";

import axios from "axios";

interface CellActionProps {
    data: ProductColumn;
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
            await axios.delete(`/api/${params.storeId}/produtos/${data.id}`);
            
            router.refresh();
            toast.success("Produto excluído com sucesso!")
        } catch (error) {
            console.log(error)
            toast.error("Algo errado aconteceu. Tente novamente mais tarde!")
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
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
                    <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/produtos/${data.id}`)}> {/* O ${params.billboardId} enviava para o "criar produtos", já o data.id envia corretamente para editar */}
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