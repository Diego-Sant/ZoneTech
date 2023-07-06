"use client";
// Marcado como componente do cliente

import { useStoreModal } from "@/hooks/useStoreModal";
import { Modal } from "@/components/ui/modal";

export const StoreModal = () => {
    const StoreModal = useStoreModal();

    return (
        <Modal title="title" description="descrição" isOpen={StoreModal.isOpen} onClose={StoreModal.onClose}>
            Formulário
        </Modal>
    )
}