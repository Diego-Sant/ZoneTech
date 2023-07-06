"use client";
// Marcado como componente do cliente

import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/useStoreModal";
import { useEffect } from "react";

const RootPage = () => {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  // Caso a janela for fechada, ele irá reabrir pois o conteúdo dentro dela é obrigatório para ser preenchido
  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen])

  return (
    <div>
      Hello
    </div>
  )
}

export default RootPage
  