// Componente do Servidor

import prismadb from "@/lib/prismadb";

import { auth } from "@clerk/nextjs";

import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params }: { params: { brandId: string } }
) {
    try {

        if (!params.brandId) {
            return new NextResponse("Id da marca é obrigatória!", {status: 400})
        }

        const brand = await prismadb.brand.findUnique({
            where: {
              id: params.brandId
            }
          });
        
        return NextResponse.json(brand);

    } catch (error) {
        console.log('[MARCA_GET]', error);
        return new NextResponse("Erro interno", {status: 500})
    }
};

export async function PATCH (
    req: Request,
    { params }: {params: {storeId: string, brandId: string}} // brandId e storeId vem da pasta [brandId] e [storeId] que vem antes desse componente
) {
    try {
        const {userId} = auth();
        const body = await req.json();

        const {name, value} = body;

        if(!userId) {
            return new NextResponse("Não autenticado!", {status: 401});
        }

        if (!name) {
            return new NextResponse("O nome é obrigatório!", {status: 400})
        }

        if (!value) {
            return new NextResponse("O ano de fundação é obrigatório!", {status: 400})
        }

        if (!params.brandId) {
            return new NextResponse("Id da marca é obrigatória!", {status: 400})
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

        const brand = await prismadb.brand.updateMany({
            where: {
                id: params.brandId
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(brand)

    } catch (error) {
        console.log('[MARCA_PATCH]', error);
        return new NextResponse("Erro interno", {status: 500})
    }
};

export async function DELETE (
    req: Request, // Apesar do req não ser usado o params precisa ser o segundo argumento para funcionar
    { params }: { params: { storeId: string, brandId: string } }
) {
    try {
        const { userId } = auth();

        if(!userId) {
            return new NextResponse("Não autenticado!", {status: 403});
        }

        if (!params.brandId) {
            return new NextResponse("Id da marca é obrigatória!", {status: 400})
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

        const brand = await prismadb.brand.deleteMany({
            where: {
              id: params.brandId
            }
          });
        
        return NextResponse.json(brand);

    } catch (error) {
        console.log('[MARCA_DELETE]', error);
        return new NextResponse("Erro interno", {status: 500})
    }
};