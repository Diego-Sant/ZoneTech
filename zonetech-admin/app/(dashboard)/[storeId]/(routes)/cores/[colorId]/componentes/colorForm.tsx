"use client";
// Marcado como componente do cliente

import { useState } from "react";
import { useForm } from "react-hook-form"
import { useParams, useRouter } from "next/navigation";
import { Color } from "@prisma/client";

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

interface ColorFormProps {
    initialData: Color | null;
}

const formSchema = z.object({
    name: z.string().min(3, "A cor precisa ter pelo menos 3 caracteres!"),
    value: z.string().min(3, "O hexadecimal da cor precisa ter pelo menos 3 caracteres!").refine(value => {
        const validHexRegex = /^#([0-9A-Fa-f]{3}){1,2}$/; // Expressão regular para verificar formato hexadecimal, além de só aceitar com 3 caracteres ou 6, ele verifica se a cor existe

        return validHexRegex.test(value);
      }, { message: "O hexadecimal precisa ser válido!" })
});

type ColorFormValues = z.infer<typeof formSchema>;

export const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Editar cor" : "Adicionar cor";
    const description = initialData ? "Edite as informações da cor" : "Adicione uma nova cor";
    const toastMessage = initialData ? "Cor atualizada com sucesso!" : "Cor adicionada com sucesso!";
    const action = initialData ? "Salvar mudanças" : "Adicionar cor";
    
    const form = useForm<ColorFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: ''
        }
    });

    const onSubmit = async (data: ColorFormValues) => {
        try {
            setLoading(true);

            // Se o initialData existir, irá aparecer como editar, caso não exista irá aparecer como criar
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/cores/${params.colorId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/cores`, data);
            }
            
            router.refresh();
            router.push(`/${params.storeId}/cores`)
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
            await axios.delete(`/api/${params.storeId}/cores/${params.colorId}`);
            
            router.refresh();
            router.push(`/${params.storeId}/cores`);
            toast.success("Marca excluída com sucesso!")
        } catch (error) {
            console.log(error)
            toast.error("Tenha certeza de remover todos os produtos dentro dessa cor primeiro!")
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
                                <FormLabel>Cor</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Mínimo de 3 caracteres" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="value" render={({field}) => (
                            <FormItem>
                                <FormLabel>Hexadecimal</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-x-4">
                                        <Input disabled={loading} placeholder="Comece o valor hexadecimal com #" {...field} />
                                        <div className="border p-4 rounded-full" style={{backgroundColor: field.value}} />
                                    </div>
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