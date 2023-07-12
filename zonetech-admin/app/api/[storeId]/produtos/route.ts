// Componente do Servidor

import prismadb from "@/lib/prismadb";

import { auth } from "@clerk/nextjs";

import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: {params: {storeId: string}} // storeId vem da pasta [storeId] que vem antes desse componente
) {
    try {
        const {userId} = auth();

        const body = await req.json();
        const {name, price, categoryId, colorId, brandId, images, isFeatured, isArchived} = body;

        if (!userId) {
            return new NextResponse("Não autenticado!", {status: 401});
        }

        if (!name) {
            return new NextResponse("O nome é obrigatório!", {status: 400})
        }

        if (!price) {
            return new NextResponse("O preço é obrigatório!", {status: 400})
        }

        if (!categoryId) {
            return new NextResponse("A categoria é obrigatória!", {status: 400})
        }

        if (!colorId) {
            return new NextResponse("A cor é obrigatória!", {status: 400})
        }

        if (!brandId) {
            return new NextResponse("A marca é obrigatória!", {status: 400})
        }

        if (!images || !images.length) {
            return new NextResponse("A imagem é obrigatória!", {status: 400})
        }

        if (!params.storeId) {
            return new NextResponse("O Id da loja é obrigatório!", {status: 400})
        }

        // Feito isso pois a única coisa que foi conferida foi se o usuário está logado, e não se a loja pertence ao usuário logado
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Não autorizado!", { status: 405 })
        }

        const product = await prismadb.product.create({
            data: {
              name,
              price,
              isFeatured,
              isArchived,
              categoryId,
              colorId,
              brandId,
              storeId: params.storeId,
              images: {
                createMany: {
                  data: [
                    ...images.map((image: { url: string }) => image),
                  ],
                },
              },
            },
          });

        return NextResponse.json(product);

    } catch (error) {
        console.log('[PRODUTO_POST]', error);
        return new NextResponse("Erro interno", {status: 500})
    }
}

export async function GET(
    req: Request,
    { params }: {params: {storeId: string}} // storeId vem da pasta [storeId] que vem antes desse componente
) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const colorId = searchParams.get("colorId") || undefined;
        const brandId = searchParams.get("brandId") || undefined;
        const isFeatured = searchParams.get("isFeatured");

        if (!params.storeId) {
            return new NextResponse("O Id da loja é obrigatório!", {status: 400})
        }

        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                colorId,
                brandId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include: {
                images: true,
                category: true,
                colors: true,
                brands: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(products);

    } catch (error) {
        console.log('[PRODUTO_GET]', error);
        return new NextResponse("Erro interno", {status: 500})
    }
}