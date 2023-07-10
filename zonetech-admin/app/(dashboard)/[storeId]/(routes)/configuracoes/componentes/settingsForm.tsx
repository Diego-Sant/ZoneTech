"use client";
// Marcado como componente do cliente

import { useState } from "react";
import { useForm } from "react-hook-form"
import { useParams, useRouter } from "next/navigation";
import { Store } from "@prisma/client";

import axios from "axios";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alertModal";
import { ApiAlert } from "@/components/ui/apiAlert";
import { useOrigin } from "@/hooks/useOrigin";

import { Trash } from "lucide-react";
import { toast } from "react-hot-toast";

interface SettingsFormProps {
    initialData: Store;
}

const formSchema = z.object({
    name: z.string().min(2, "A loja precisa ter pelo menos 2 caracteres!")
});

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });

    const onSubmit = async (data: SettingsFormValues) => {
        try {
            setLoading(true);
            await axios.patch(`/api/lojas/${params.storeId}`, data);
            router.refresh();
            
            toast.success("Nome da loja atualizado com sucesso!")
        } catch (error) {
            toast.error("Algo de errado aconteceu, tente novamente mais tarde!")
        } finally {
            setLoading(false)
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/lojas/${params.storeId}`);
            
            router.refresh();
            router.push("/"); // Feito isso para caso tenha apenas uma loja e ela for excluida, será enviado para a tela de criar uma loja nova
            toast.success("Loja excluída com sucesso!")
        } catch (error) {
            console.log(error)
            toast.error("Tenha certeza de remover todos os produtos e categorias primeiro!")
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }
    
    return (
        <>
            <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} store={initialData} />
            <div className="flex items-center justify-between">
                <Heading title="Configurações" description="Configure as preferências da loja" />
                <Button disabled={loading} variant="destructive" size="icon" onClick={() => setOpen(true)}>
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FormField control={form.control} name="name" render={({field}) => (
                            <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Nome da loja" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                    <Button disabled={loading} type="submit">Salvar mudanças</Button>
                </form>
            </Form>
            <Separator />
            <ApiAlert title="URL DA API" description={`${origin}/api/${params.storeId}`} variant="public" />
        </>
    )
}