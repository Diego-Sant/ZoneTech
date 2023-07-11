"use client";
// Marcado como componente do cliente

import { cn } from "@/lib/utils";

import Link from "next/link";

import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";

import { AlignJustify, Home, Image, Settings } from "lucide-react";

export function MainNav({className, ...props}: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname();
    const params = useParams();
    
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
          setIsMobile(window.innerWidth <= 740);
        };
    
        handleResize();
    
        window.addEventListener("resize", handleResize);
    
        return () => {
          window.removeEventListener("resize", handleResize);
        };
    }, []);

    const routes = [
        {
            href: `/${params.storeId}`, // URL onde irá ser enviado
            icon: <Home className="w-4 h-4 mr-2" />,
            label: 'Menu principal',
            active: pathname === `/${params.storeId}` // Quando estiver nesse pathname, ele será considerado active
        },
        {
            href: `/${params.storeId}/configuracoes`, // URL onde irá ser enviado
            icon: <Settings className="w-4 h-4 mr-2" />,
            label: 'Configurações',
            active: pathname === `/${params.storeId}/configuracoes` // Quando estiver nesse pathname, ele será considerado active
        },
        {
            href: `/${params.storeId}/painel`, // URL onde irá ser enviado
            // eslint-disable-next-line jsx-a11y/alt-text
            icon: <Image className="w-4 h-4 mr-2" />,
            label: 'Painel publicitário',
            active: pathname === `/${params.storeId}/painel` // Quando estiver nesse pathname, ele será considerado active
        }
    ];

    if (isMobile) {
        return (
          <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="w-30 h-9" variant="outline"><AlignJustify className="w-4 h-4 mr-2" />Menu</Button>
            </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel className="flex justify-center items-center">Menu Responsivo</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {routes.map((route) => (
                  <DropdownMenuItem key={route.href}>
                    <Link href={route.href} className={cn("text-sm flex items-center font-medium transition-colors hover:text-primary", route.active ? "text-black dark:text-white" : "text-muted-foreground")}>
                      {route.icon}{route.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        );
    }

    return (
        <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
          {routes.map((route) => (
            <Link key={route.href} href={route.href} className={cn("text-sm font-medium transition-colors hover:text-primary", route.active ? "text-black dark:text-white" : "text-muted-foreground")}>
              {route.label}
            </Link>
          ))}
        </nav>
    );
}