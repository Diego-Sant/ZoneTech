"use client"
// Marcado como componente do cliente

import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Badge, BadgeProps } from "./badge";
import { Button } from "./button";

import { Copy, Server } from "lucide-react";

import { toast } from "react-hot-toast";

interface ApiAlertProps {
    title: string;
    description: string;
    variant: "public" | "admin";
};

const textMap: Record<ApiAlertProps["variant"], string> = {
    public: "Público",
    admin: "Administrador"
};

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
    public: "secondary",
    admin: "destructive"
};

export const ApiAlert: React.FC<ApiAlertProps> = ({ title, description, variant = "public"}) => {
    
    const onCopy = () => {
        navigator.clipboard.writeText(description);
        toast.success("Rota da API copiada com sucesso!");
    }
    
    return (
        <Alert>
            <Server className="h-4 w-4 mt-1" />
            <AlertTitle className="flex gap-x-2 items-center">
                {title}
                <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
            </AlertTitle>
            <AlertDescription className="mt-4 flex items-center justify-between">
                <code className="relative mr-10 rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                    {description}
                </code>
                <Button variant="outline" size="icon" onClick={onCopy}>
                    <Copy className="h-4 w-4 mx-2" />
                </Button>
            </AlertDescription>
        </Alert>
    )
}