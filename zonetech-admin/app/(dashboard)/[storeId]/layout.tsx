// Componente do Servidor

import prismadb from "@/lib/prismadb";

import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: {storeId: string}
}) {
    const {userId} = auth();

    // Caso não seja detectado um id, será redirecionado para o login
    if (!userId) {
        redirect('/entrar');
    }

    // Confere se o usuário tem alguma loja criada, e irá mostrar a primeira por padrão
    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId, // Pegou o id que foi gerado no layout dentro de (root)
            userId
        }
    });

    // Caso a loja não exista, será redirecionado ao menu principal
    if (!store) {
        redirect("/");
    }

    return (
        <>
            <div>Navbar</div>
            {children}
        </>
    )

}