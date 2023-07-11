"use client";
// Marcado como componente do cliente

import { useState } from "react";
import { useForm } from "react-hook-form"
import { useParams, useRouter } from "next/navigation";
import { Brand } from "@prisma/client";

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

interface BrandFormProps {
    initialData: Brand | null;
}

const formSchema = z.object({
    name: z.string().min(1, "A marca precisa ter pelo menos 1 caractere!"),
    value: z.string().min(4, "O ano de fundação precisa ter o ano completo! Ex: 2000").max(4, "O ano de fundação só pode ter 4 números! Ex: 2000")
});

type BrandFormValues = z.infer<typeof formSchema>;

export const BrandForm: React.FC<BrandFormProps> = ({ initialData }) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Editar marca" : "Adicionar marca";
    const description = initialData ? "Edite as informações da marca" : "Adicione uma nova marca parceira";
    const toastMessage = initialData ? "Marca atualizada com sucesso!" : "Marca adicionada com sucesso!";
    const action = initialData ? "Salvar mudanças" : "Adicionar marca";
    
    const form = useForm<BrandFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: ''
        }
    });

    const onSubmit = async (data: BrandFormValues) => {
        try {
            setLoading(true);

            // Se o initialData existir, irá aparecer como editar, caso não exista irá aparecer como criar
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/marca/${params.brandId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/marca`, data);
            }
            
            router.refresh();
            router.push(`/${params.storeId}/marca`)
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
            await axios.delete(`/api/${params.storeId}/marca/${params.brandId}`);
            
            router.refresh();
            router.push(`/${params.storeId}/marca`);
            toast.success("Marca excluída com sucesso!")
        } catch (error) {
            console.log(error)
            toast.error("Tenha certeza de remover todos os produtos dentro desse marca primeiro!")
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FormField control={form.control} name="name" render={({field}) => (
                            <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Mínimo de 1 caractere" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="value" render={({field}) => (
                            <FormItem>
                                <FormLabel>Ano de fundação</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} type="number" placeholder="Mínimo de 4 números" {...field} />
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