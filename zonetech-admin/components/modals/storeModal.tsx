"use client";
// Marcado como componente do cliente

import axios from "axios";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useStoreModal } from "@/hooks/useStoreModal";
import { Modal } from "@/components/ui/modal";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {toast} from "react-hot-toast";

import { useForm } from "react-hook-form";
import { useState } from "react";

const formSchema = z.object({
    name: z.string().min(2, "A loja precisa ter pelo menos 2 caracteres!") // Pelo menos 2 caracteres é obrigatório ao colocar o nome da loja
})

export const StoreModal = () => {
    const StoreModal = useStoreModal();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);

            const response = await axios.post('/api/lojas', values);

            window.location.assign(`/${response.data.id}`) // Feito isso ao em vez do router pois ele vai atualizar completamente a aba e o router estava tendo problemas em relação a isso
        } catch (error) {
            toast.error("Algo deu errado ao continuar.");
        } finally {
            setLoading(false);
        }
    }

    const { handleSubmit, formState } = form;
    const { errors } = formState;

    return (
        <Modal title="Criar loja" description="Coloque o nome da sua loja para começarmos! 😊" isOpen={StoreModal.isOpen} onClose={StoreModal.onClose}>
            <div>
                <div className="space-y-4 py-2 pb-4">
                   <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormField control={form.control} name="name" render={({field}) => (
                                <FormItem>
                                    <FormLabel className="pl-1">Nome</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Mínimo de 2 caracteres" {...field} />
                                    </FormControl>
                                    {errors?.name && (
                                        <FormMessage className="pl-1">{errors.name.message}</FormMessage>
                                    )}
                                </FormItem>
                            )} />
                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                <Button disabled={loading} variant="outline" onClick={StoreModal.onClose}>Cancelar</Button>
                                <Button disabled={loading} type="submit">Continuar</Button>
                            </div>
                            
                        </form>
                   </Form>
                </div>
            </div>
        </Modal>
    )
}