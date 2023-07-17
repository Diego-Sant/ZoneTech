// Componente do Servidor

import prismadb from "@/lib/prismadb";

import { auth } from "@clerk/nextjs";

import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params }: { params: { categoryId: string } }
) {
    try {

        if (!params.categoryId) {
            return new NextResponse("Id da categoria é obrigatória!", {status: 400})
        }

        const category = await prismadb.category.findUnique({
            where: {
              id: params.categoryId
            },
            include: {
                billboard: true,
            }
          });
        
        return NextResponse.json(category);

    } catch (error) {
        console.log('[CATEGORIA_GET]', error);
        return new NextResponse("Erro interno", {status: 500})
    }
};

export async function PATCH (
    req: Request,
    { params }: {params: {storeId: string, categoryId: string}} // categoryId e storeId vem da pasta [categoryId] e [storeId] que vem antes desse componente
) {
    try {
        const {userId} = auth();
        const body = await req.json();

        const {name, billboardId} = body;

        if(!userId) {
            return new NextResponse("Não autenticado!", {status: 401});
        }

        if (!name) {
            return new NextResponse("O nome é obrigatório!", {status: 400})
        }

        if (!billboardId) {
            return new NextResponse("O painel é obrigatório!", {status: 400})
        }

        if (!params.categoryId) {
            return new NextResponse("Id da categoria é obrigatória!", {status: 400})
        }

        // Feito isso pois a única coisa que foi conferida foi se o usuário está logado, e não se a loja pertence ao usuário logado
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });
        
        if (!storeByUserId) {
            return new NextResponse("Não autorizado!", { status: 403 })
        }

        const category = await prismadb.category.updateMany({
            where: {
                id: params.categoryId
            },
            data: {
                name,
                billboardId
            }
        });

        return NextResponse.json(category)

    } catch (error) {
        console.log('[CATEGORIA_PATCH]', error);
        return new NextResponse("Erro interno", {status: 500})
    }
};

export async function DELETE (
    req: Request, // Apesar do req não ser usado o params precisa ser o segundo argumento para funcionar
    { params }: { params: { storeId: string, categoryId: string } }
) {
    try {
        const { userId } = auth();

        if(!userId) {
            return new NextResponse("Não autenticado!", {status: 403});
        }

        if (!params.categoryId) {
            return new NextResponse("Id da categoria é obrigatória!", {status: 400})
        }

        // Feito isso pois a única coisa que foi conferida foi se o usuário está logado, e não se a loja pertence ao usuário logado
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });
                
        if (!storeByUserId) {
            return new NextResponse("Não autorizado!", { status: 403 })
        }

        const category = await prismadb.category.deleteMany({
            where: {
              id: params.categoryId
            }
          });
        
        return NextResponse.json(category);

    } catch (error) {
        console.log('[CATEGORIA_DELETE]', error);
        return new NextResponse("Erro interno", {status: 500})
    }
};