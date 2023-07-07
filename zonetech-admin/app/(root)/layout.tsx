import prismadb from "@/lib/prismadb";

import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const {userId} = auth();

    // Caso não seja detectado um id, será redirecionado para o login
    if (!userId) {
        redirect('/entrar');
    }

    // Confere se o usuário tem alguma loja criada, e irá mostrar a primeira por padrão
    const store = await prismadb.store.findFirst({
        where: {
            userId
        }
    });

    // Caso a loja exista, irá redirecionar para o id da loja procurada
    if (store) {
        redirect(`/${store.id}`) // Enviou para a pastar [storeId] onde o id da loja é automaticamente gerado
    }

    return (
        <>
            {children}
        </>
    )
}