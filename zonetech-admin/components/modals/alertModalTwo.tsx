"use client";
// Marcado como componente do cliente

import { useEffect, useState } from "react";

import { Billboard, Store } from "@prisma/client";
import { BillboardColumn } from "@/app/(dashboard)/[storeId]/(routes)/painel/componentes/columns";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface AlertModalTwoProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
    billboardColumn?: BillboardColumn;
}

export const AlertModalTwo: React.FC<AlertModalTwoProps> = ({ isOpen, onClose, onConfirm, loading, billboardColumn}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) {
        return null;
    }

    const currentBillboardColumn = billboardColumn?.label

    return (
        <Modal title={`Você tem certeza que deseja excluir "${currentBillboardColumn}"?`} description={`"${currentBillboardColumn}" será perdida para sempre! (é muito tempo!)`} isOpen={isOpen} onClose={onClose}>
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