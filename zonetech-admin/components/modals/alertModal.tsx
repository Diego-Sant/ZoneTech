"use client";
// Marcado como componente do cliente

import { useEffect, useState } from "react";

import { Billboard, Store } from "@prisma/client";
import { BillboardColumn } from "@/app/(dashboard)/[storeId]/(routes)/painel/componentes/columns";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
    store?: Store;
}

export const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, onConfirm, loading, store}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) {
        return null;
    }

    const currentStore = store?.name;

    const noContent = !currentStore;
    const title = noContent ? "Tem certeza que deseja excluir esse painel?" : `Você tem certeza que deseja excluir "${currentStore}"?`;
    const description = noContent ? "Esse painel será perdido para sempre! (é muito tempo!)" : `"${currentStore}" será perdida para sempre! (é muito tempo!)`;

    return (
        <Modal title={title} description={description} isOpen={isOpen} onClose={onClose}>
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