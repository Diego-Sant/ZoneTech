"use client";
// Marcado como componente do cliente

import { Store } from "@prisma/client"
import { cn } from "@/lib/utils";

import { Button } from "./ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover"
import { useStoreModal } from "@/hooks/useStoreModal";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps {
    items: Store[];
}

export default function StoreSwitcher({className, items = []}: StoreSwitcherProps) {
    const [open, setOpen] = useState(false);

    const storeModal = useStoreModal();
    const params = useParams();
    const router = useRouter();

    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id
    }));

    // Comparar se o id da loja atual confere com o id que está na url([storeId])
    const currentStore = formattedItems.find((item) => item.value === params.storeId);

    const onStoreSelect = (store: {value: string, label: string}) => {
        setOpen(false);
        router.push(`/${store.value}`);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" role="combobox" aria-expanded={open} aria-label="Escolha uma loja" className={cn("w-[200px] justify-between", className)}>
                    <StoreIcon className="mr-2 h-4 w-4" />
                    {currentStore?.label}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Procure uma loja..." />
                        <CommandEmpty>
                            <p className="text-[13px]">Nenhuma loja encontrada! 😔</p>
                        </CommandEmpty>
                        <CommandGroup heading="Lojas">
                            {formattedItems.map((store) => (
                                <CommandItem key={store.value} onSelect={() => onStoreSelect(store)} className="text-sm">
                                    <StoreIcon className="mr-2 h-4 w-4" />
                                    {store.label}
                                    <Check className={cn("ml-auto h-4 w-4", currentStore?.value === store.value ? "opacity-100" : "opacity-0")} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator />
                    <CommandList>
                        <CommandGroup>
                            <CommandItem onSelect={() => {setOpen(false); storeModal.onOpen()}}>
                                <PlusCircle className="mr-2 h-5 w-5" />
                                Criar loja
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}