"use client";
// Marcado como componente do cliente

import { useState } from "react";
import { useForm } from "react-hook-form"
import { useParams, useRouter } from "next/navigation";
import { Brand, Category, Color, Image, Product } from "@prisma/client";

import axios from "axios";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alertModal";
import ImageUpload from "@/components/ui/imageUpload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import { Trash } from "lucide-react";
import { toast } from "react-hot-toast";

interface ProductFormProps {
    initialData: Product & {
        images: Image[]
    } | null;
    categories: Category[];
    colors: Color[];
    brands: Brand[];
}

const formSchema = z.object({
    name: z.string().min(2, "O painel precisa ter pelo menos 2 caracteres!"),
    images: z.object({url: z.string()}).array().min(1, "A imagem é obrigatória!"),
    price: z.coerce.number().min(1, "O preço é obrigatório!"),
    categoryId: z.string().min(1, "A categoria é obrigatória!"),
    colorId: z.string().min(1, "A cor é obrigatória!"),
    brandId: z.string().min(1, "A marca é obrigatória!"),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, categories, colors, brands }) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Editar produto" : "Adicionar produto";
    const description = initialData ? "Edite o produto" : "Adicione um novo produto";
    const toastMessage = initialData ? "Produto atualizado com sucesso!" : "Produto adicionado com sucesso!";
    const action = initialData ? "Salvar mudanças" : "Adicionar produto";
    
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? { ...initialData, price: parseFloat(String(initialData?.price)) } : {
            name: '',
            images: [],
            price: 0,
            categoryId: '',
            colorId: '',
            brandId: '',
            isFeatured: false,
            isArchived: false,
        }
    });

    const onSubmit = async (data: ProductFormValues) => {
        try {
            setLoading(true);

            // Se o initialData existir, irá aparecer como editar, caso não exista irá aparecer como criar
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/produtos/${params.productId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/produtos`, data);
            }
            
            router.refresh();
            router.push(`/${params.storeId}/produtos`) // Ao apertar em criar painel ou salvar mudanças irá ser enviado para o menu de painel publicitário
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
            await axios.delete(`/api/${params.storeId}/produtos/${params.productId}`);
            
            router.refresh();
            router.push(`/${params.storeId}/produtos`); // Feito isso para caso tenha apenas uma loja e ela for excluida, será enviado para a tela de criar uma loja nova
            toast.success("Painel excluído com sucesso!")
        } catch (error) {
            console.log(error)
            toast.error("Algo de errado aconteceu, tente novamente mais tarde!")
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
                    <FormField control={form.control} name="images" render={({field}) => (
                        <FormItem>
                            <FormLabel>Imagens</FormLabel>
                            <FormControl>
                                {/* Configuração usada para adicionar diversas imagens e cada uma ter sua própria funcionalidade, ou seja, se eu excluir uma imagem, a outra continuará intacta */}
                                <ImageUpload 
                                    value={field.value.map((image) => image.url)} 
                                    disabled={loading} 
                                    onChange={(url) => field.onChange([...field.value, {url}])} 
                                    onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FormField control={form.control} name="name" render={({field}) => (
                            <FormItem>
                                <FormLabel>Nome do produto</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Mínimo de 2 caracteres" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="price" render={({field}) => (
                            <FormItem>
                                <FormLabel>Preço</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} type="number" placeholder="Ex: 9999,99" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="categoryId" render={({field}) => (
                            <FormItem>
                                <FormLabel>Categoria</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Selecione um painel" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="colorId" render={({field}) => (
                            <FormItem>
                                <FormLabel>Cor</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Selecione um painel" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {colors.map((color) => (
                                                <SelectItem key={color.id} value={color.id}>
                                                    {color.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="brandId" render={({field}) => (
                            <FormItem>
                                <FormLabel>Marca</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Selecione um painel" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {brands.map((brand) => (
                                                <SelectItem key={brand.id} value={brand.id}>
                                                    {brand.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="isFeatured" render={({field}) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox checked={field.value}
                                    // @ts-ignore
                                    onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Destacar
                                    </FormLabel>
                                    <FormDescription>
                                        Esse produto irá aparecer na tela de menu inicial.
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="isArchived" render={({field}) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox checked={field.value}
                                    // @ts-ignore
                                    onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Arquivar
                                    </FormLabel>
                                    <FormDescription>
                                        Esse produto NÃO irá aparecer na tela de menu inicial.
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )} />
                    </div>
                    <Button disabled={loading} type="submit">{action}</Button>
                </form>
            </Form>
        </>
    )
}