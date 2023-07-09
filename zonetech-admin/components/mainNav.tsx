"use client";
// Marcado como componente do cliente

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export function MainNav({className, ...props}: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname();
    const params = useParams();

    const routes = [
        {
            href: `/${params.storeId}`, // URL onde irá ser enviado
            
            label: 'Menu principal',
            active: pathname === `/${params.storeId}` // Quando estiver nesse pathname, ele será considerado active
        },
        {
            href: `/${params.storeId}/configuracoes`, // URL onde irá ser enviado
            
            label: 'Configurações',
            active: pathname === `/${params.storeId}/configuracoes` // Quando estiver nesse pathname, ele será considerado active
        }
    ];

    return (
        <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
            {routes.map((route) => (
                <Link key={route.href} href={route.href} className={cn("text-sm font-medium transition-colors hover:text-primary", route.active ? "text-black dark:text-white" : "text-muted-foreground")}> {/* quando estiver active, ele será cor preta ou branca dependendo do modo, e caso não esteja ativa ele será uma cor cinza */}
                    {route.label}
                </Link>
            ))}
        </nav>
    )
}