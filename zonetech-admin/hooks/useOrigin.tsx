// Componente do Servidor

import { useEffect, useState } from "react"

export const useOrigin = () => {
    const [mounted, setMounted] = useState(false);
    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : ''; // Conferindo se a janela é indefinida, depois conferindo se ela existe, caso exista, irá aparecer o origin, caso não exista, irá retornar vazio

    useEffect(() => {
        setMounted(true);
    }, [])

    if (!mounted) {
        return '';
    }

    return origin;
}