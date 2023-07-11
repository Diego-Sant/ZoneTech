"use client";
// Marcado como componente do cliente

import { useState } from "react";
import { useForm } from "react-hook-form"
import { useParams, useRouter } from "next/navigation";
import { Billboard, Category } from "@prisma/client";

import axios from "axios";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModalTwo } from "@/components/modals/alertModalTwo";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Trash } from "lucide-react";
import { toast } from "react-hot-toast";

interface CategoryFormProps {
    initialData: Category | null;
    billboards: Billboard[];
}

const formSchema = z.object({
    name: z.string().min(2, "A categoria precisa ter pelo menos 2 caracteres!"),
    billboardId: z.string().min(1)
});

type CategoryFormValues = z.infer<typeof formSchema>;

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, billboards }) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Editar categoria" : "Criar categoria";
    const description = initialData ? "Edite a categoria" : "Crie uma nova categoria";
    const toastMessage = initialData ? "Categoria atualizada com sucesso!" : "Categoria criada com sucesso!";
    const action = initialData ? "Salvar mudanças" : "Adicionar categoria";
    
    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            billboardId: ''
        }
    });

    const onSubmit = async (data: CategoryFormValues) => {
        try {
            setLoading(true);

            // Se o initialData existir, irá aparecer como editar, caso não exista irá aparecer como criar
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/categorias/${params.categoryId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/categorias`, data);
            }
            
            router.refresh();
            router.push(`/${params.storeId}/categorias`)
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
            await axios.delete(`/api/${params.storeId}/categorias/${params.categoryId}`);
            
            router.refresh();
            router.push(`/${params.storeId}/categorias`); // Feito isso para caso tenha apenas uma loja e ela for excluida, será enviado para a tela de criar uma loja nova
            toast.success("Categoria excluída com sucesso!")
        } catch (error) {
            console.log(error)
            toast.error("Tenha certeza de remover todos os produtos dentro dessa categoria primeiro!")
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }
    
    return (
        <>
            <AlertModalTwo isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
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
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                        
                        <FormField control={form.control} name="name" render={({field}) => (
                            <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Mínimo de 2 caracteres" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="billboardId" render={({field}) => (
                            <FormItem>
                                <FormLabel>Painel</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Selecione um painel" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {billboards.map((billboard) => (
                                                <SelectItem key={billboard.id} value={billboard.id}>
                                                    {billboard.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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