// Componente do Servidor

import prismadb from "@/lib/prismadb";

import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH (
    req: Request,
    { params }: { params: {storeId: string}}
) {
    try {
        const {userId} = auth();
        const body = await req.json();

        const {name} = body;

        if(!userId) {
            return new NextResponse("Não autenticado!", {status: 401});
        }

        if (!name) {
            return new NextResponse("O nome é obrigatório!", {status: 400})
        }

        if (!params.storeId) {
            return new NextResponse("Id da loja é obrigatório!", {status: 400})
        }

        // UpdateMany irá fazer todo o trabalho de atualizar o "name" do data conferindo o id da loja e o id do usuário
        const store = await prismadb.store.updateMany({
            where: {
                id: params.storeId,
                userId
            },
            data: {
                name
            }
        });

        return NextResponse.json(store)

    } catch (error) {
        console.log('[LOJA_PATCH]', error);
        return new NextResponse("Erro interno", {status: 500})
    }
};

export async function DELETE (
    req: Request, // Apesar do req não ser usado o params precisa ser o segundo argumento para funcionar
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth();

        if(!userId) {
            return new NextResponse("Não autenticado!", {status: 403});
        }

        if (!params.storeId) {
            return new NextResponse("Id da loja é obrigatório!", {status: 400})
        }

        // deleteMany irá fazer todo o trabalho de deletar tudo envolvendo a loja conferindo o id da loja e o id do usuário
        // Usado deleteMany ao em vez do delete pois o userId não é único
        const store = await prismadb.store.deleteMany({
            where: {
              id: params.storeId,
              userId
            }
          });
        
        return NextResponse.json(store);

    } catch (error) {
        console.log('[LOJA_DELETE]', error);
        return new NextResponse("Erro interno", {status: 500})
    }
};