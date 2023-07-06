"use client"; 
// Marcado como componente do cliente

import { StoreModal } from "@/components/modals/storeModal";

import { useEffect, useState } from "react";

// Não é possível adicionar um componente de cliente(ModalProvider) em um componente de servidor(layout.tsx)
// Essa configuração é um macete para previnir um hydration error
export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) {
        return null; // quando o setIsMounted terminar, irá enviar para o componente de servidor
    }

    // Configuração para o componente de cliente antes que ele vá para o servidor
    return (
        <StoreModal />
    )
}