"use client";
// Marcado como componente do cliente

import { useState } from "react";
import { useForm } from "react-hook-form"
import { useParams, useRouter } from "next/navigation";
import { Billboard } from "@prisma/client";

import axios from "axios";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alertModal";

import { Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import ImageUpload from "@/components/ui/imageUpload";

interface BillboardFormProps {
    initialData: Billboard | null;
}

const formSchema = z.object({
    label: z.string().min(2, "O painel precisa ter pelo menos 2 caracteres!"),
    imageUrl: z.string().min(1, "A imagem é obrigatória!")
});

type BillboardFormValues = z.infer<typeof formSchema>;

export const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Editar painel" : "Criar painel";
    const description = initialData ? "Edite o painel" : "Crie um novo painel";
    const toastMessage = initialData ? "Painel atualizado com sucesso!" : "Painel criado com sucesso!";
    const action = initialData ? "Salvar mudanças" : "Adicionar painel";
    
    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: '',
            imageUrl: ''
        }
    });

    const onSubmit = async (data: BillboardFormValues) => {
        try {
            setLoading(true);

            // Se o initialData existir, irá aparecer como editar, caso não exista irá aparecer como criar
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/painel/${params.billboardId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/painel`, data);
            }
            
            router.refresh();
            router.push(`/${params.storeId}/painel`) // Ao apertar em criar painel ou salvar mudanças irá ser enviado para o menu de painel publicitário
            toast.success(toastMessage)
        } catch (error) {
            toast.error("Algo de errado aconteceu, tente novamente mais tarde!")
        } finally {
            setLoading(false)
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/painel/${params.billboardId}`);
            
            router.refresh();
            router.push(`/${params.storeId}/painel`); // Feito isso para caso tenha apenas uma loja e ela for excluida, será enviado para a tela de criar uma loja nova
            toast.success("Painel excluído com sucesso!")
        } catch (error) {
            console.log(error)
            toast.error("Tenha certeza de remover todos as categorias dentro desse painel primeiro!")
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }
    
    return (
        <>
            <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                {initialData && (
                    <Button disabled={loading} variant="destructive" size="icon" onClick={() => setOpen(true)}>
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                    <FormField control={form.control} name="imageUrl" render={({field}) => (
                        <FormItem>
                            <FormLabel>Imagem de fundo</FormLabel>
                            <FormControl>
                                <ImageUpload value={field.value ? [field.value] : []} disabled={loading} onChange={(url) => field.onChange(url)} onRemove={() => field.onChange("")} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FormField control={form.control} name="label" render={({field}) => (
                            <FormItem>
                                <FormLabel>Título</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Mínimo de 2 caracteres" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                    <Button disabled={loading} type="submit">{action}</Button>
                </form>
            </Form>
        </>
    )
}