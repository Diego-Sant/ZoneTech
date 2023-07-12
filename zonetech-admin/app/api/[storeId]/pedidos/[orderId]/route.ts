// Componente do Servidor

import prismadb from "@/lib/prismadb";

import { auth } from "@clerk/nextjs";

import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params }: { params: { billboardId: string } }
) {
    try {

        if (!params.billboardId) {
            return new NextResponse("Id do painel é obrigatório!", {status: 400})
        }

        const billboard = await prismadb.billboard.findUnique({
            where: {
              id: params.billboardId
            }
          });
        
        return NextResponse.json(billboard);

    } catch (error) {
        console.log('[PAINEL_GET]', error);
        return new NextResponse("Erro interno", {status: 500})
    }
};

export async function PATCH (
    req: Request,
    { params }: {params: {storeId: string, billboardId: string}} // billboardId e storeId vem da pasta [billboardId] e [storeId] que vem antes desse componente
) {
    try {
        const {userId} = auth();
        const body = await req.json();

        const {label, imageUrl} = body;

        if(!userId) {
            return new NextResponse("Não autenticado!", {status: 401});
        }

        if (!label) {
            return new NextResponse("O campo é obrigatório!", {status: 400})
        }

        if (!imageUrl) {
            return new NextResponse("A imagem é obrigatória!", {status: 400})
        }

        if (!params.billboardId) {
            return new NextResponse("Id do painel é obrigatório!", {status: 400})
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

        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: params.billboardId
            },
            data: {
                label,
                imageUrl
            }
        });

        return NextResponse.json(billboard)

    } catch (error) {
        console.log('[PAINEL_PATCH]', error);
        return new NextResponse("Erro interno", {status: 500})
    }
};

export async function DELETE (
    req: Request, // Apesar do req não ser usado o params precisa ser o segundo argumento para funcionar
    { params }: { params: { storeId: string, billboardId: string } }
) {
    try {
        const { userId } = auth();

        if(!userId) {
            return new NextResponse("Não autenticado!", {status: 403});
        }

        if (!params.billboardId) {
            return new NextResponse("Id do painel é obrigatório!", {status: 400})
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

        const billboard = await prismadb.billboard.deleteMany({
            where: {
              id: params.billboardId
            }
          });
        
        return NextResponse.json(billboard);

    } catch (error) {
        console.log('[PAINEL_DELETE]', error);
        return new NextResponse("Erro interno", {status: 500})
    }
};