"use client";
// Marcado como componente do cliente

import { useEffect, useState } from "react";

import { BillboardColumn } from "@/app/(dashboard)/[storeId]/(routes)/painel/componentes/columns";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Category } from "@prisma/client";

interface AlertModalTwoProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
    billboardColumn?: BillboardColumn;
    categoryColumn?: Category;
    useCurrentStore?: boolean;
}

export const AlertModalTwo: React.FC<AlertModalTwoProps> = ({ isOpen, onClose, onConfirm, loading, billboardColumn, categoryColumn, useCurrentStore = true}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) {
        return null;
    }

    return (
        <Modal title="Você tem certeza que deseja excluir essa categoria?" description="essa categoria será perdida para sempre! (é muito tempo!)" isOpen={isOpen} onClose={onClose}>
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button disabled={loading} variant="outline" onClick={onClose}>
                    Cancelar
                </Button>
                <Button disabled={loading} variant="destructive" onClick={onConfirm}>
                    Excluir
                </Button>
            </div>
        </Modal>
    )
}