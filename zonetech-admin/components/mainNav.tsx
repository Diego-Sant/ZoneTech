"use client";
// Marcado como componente do cliente

import { cn } from "@/lib/utils";

import Link from "next/link";

import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdownMenu";
import { Button } from "./ui/button";

import { AlignJustify, Hexagon, Home, Image, Laptop, Palette, PanelTopClose, ScrollText, Settings } from "lucide-react";

export function MainNav({className, ...props}: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname();
    const params = useParams();
    
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
          setIsMobile(window.innerWidth <= 1200);
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
            href: `/${params.storeId}/painel`, // URL onde irá ser enviado
            // eslint-disable-next-line jsx-a11y/alt-text
            icon: <Image className="w-4 h-4 mr-2" />,
            label: 'Painel publicitário',
            active: pathname === `/${params.storeId}/painel` // Quando estiver nesse pathname, ele será considerado active
        },
        {
          href: `/${params.storeId}/categorias`, // URL onde irá ser enviado
          icon: <PanelTopClose className="w-4 h-4 mr-2" />,
          label: 'Categorias',
          active: pathname === `/${params.storeId}/categorias` // Quando estiver nesse pathname, ele será considerado active
        },
        {
          href: `/${params.storeId}/marca`, // URL onde irá ser enviado
          icon: <Hexagon className="w-4 h-4 mr-2" />,
          label: 'Marcas',
          active: pathname === `/${params.storeId}/marca` // Quando estiver nesse pathname, ele será considerado active
        },
        {
          href: `/${params.storeId}/cores`, // URL onde irá ser enviado
          icon: <Palette className="w-4 h-4 mr-2" />,
          label: 'Cores',
          active: pathname === `/${params.storeId}/cores` // Quando estiver nesse pathname, ele será considerado active
        },
        {
          href: `/${params.storeId}/produtos`, // URL onde irá ser enviado
          icon: <Laptop className="w-4 h-4 mr-2" />,
          label: 'Produtos',
          active: pathname === `/${params.storeId}/produtos` // Quando estiver nesse pathname, ele será considerado active
        },
        {
          href: `/${params.storeId}/pedidos`, // URL onde irá ser enviado
          icon: <ScrollText className="w-4 h-4 mr-2" />,
          label: 'Pedidos',
          active: pathname === `/${params.storeId}/pedidos` // Quando estiver nesse pathname, ele será considerado active
        },
        {
          href: `/${params.storeId}/configuracoes`, // URL onde irá ser enviado
          icon: <Settings className="w-4 h-4 mr-2" />,
          label: 'Configurações',
          active: pathname === `/${params.storeId}/configuracoes` // Quando estiver nesse pathname, ele será considerado active
        },
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
                  <Link key={route.href} href={route.href} className={cn("text-sm flex items-center font-medium transition-colors hover:text-primary", route.active ? "text-black dark:text-white" : "text-muted-foreground")}>
                    <DropdownMenuItem className="cursor-pointer">
                        {route.icon}{route.label}
                    </DropdownMenuItem>
                  </Link>
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