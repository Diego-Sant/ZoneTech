"use client";
// Marcado como componente do cliente

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog";

interface ModalProps {
    title: string;
    description: string;
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
    title,
    description,
    isOpen,
    onClose,
    children
}) => {
    const onChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    };

    return (
        // onOpenChange providencia o open: boolean
        <Dialog open={isOpen} onOpenChange={onChange}> {/* informações de API sobre Dialog e outros componentes é feita no site https://www.radix-ui.com/docs/primitives/components/dialog */}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div>
                    {children} {/* children é basicamente usado para o texto principal, onde ficará abaixo do título e da descrição */}
                </div>
            </DialogContent>
        </Dialog>
    )
}