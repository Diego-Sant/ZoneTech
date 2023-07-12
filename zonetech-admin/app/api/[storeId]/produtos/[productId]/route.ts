// Componente do Servidor

import prismadb from "@/lib/prismadb";

import { auth } from "@clerk/nextjs";

import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params }: { params: { productId: string } }
) {
    try {

        if (!params.productId) {
            return new NextResponse("Id do produto é obrigatório!", {status: 400})
        }

        const product = await prismadb.product.findUnique({
            where: {
              id: params.productId
            },
            include: {
                images: true,
                category: true,
                brands: true,
                colors: true
            }
          });
        
        return NextResponse.json(product);

    } catch (error) {
        console.log('[PRODUTO_GET]', error);
        return new NextResponse("Erro interno", {status: 500})
    }
};

export async function PATCH (
    req: Request,
    { params }: {params: {storeId: string, productId: string}} // productId e storeId vem da pasta [productId] e [storeId] que vem antes desse componente
) {
    try {
        const {userId} = auth();
        const body = await req.json();

        const {name, price, categoryId, colorId, brandId, images, isFeatured, isArchived} = body;

        if(!userId) {
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

        if (!params.productId) {
            return new NextResponse("Id do produto é obrigatório!", {status: 400})
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

        await prismadb.product.update({
            where: {
              id: params.productId
            },
            data: {
              name,
              price,
              categoryId,
              colorId,
              brandId,
              images: {
                deleteMany: {},
              },
              isFeatured,
              isArchived,
            },
        });
      
        const product = await prismadb.product.update({
            where: {
              id: params.productId
            },
            data: {
              images: {
                createMany: {
                  data: [
                    ...images.map((image: { url: string }) => image),
                  ],
                },
              },
            },
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log('[PRODUTO_PATCH]', error);
        return new NextResponse("Erro interno", {status: 500})
    }
};

export async function DELETE (
    req: Request, // Apesar do req não ser usado o params precisa ser o segundo argumento para funcionar
    { params }: { params: { storeId: string, productId: string } }
) {
    try {
        const { userId } = auth();

        if(!userId) {
            return new NextResponse("Não autenticado!", {status: 403});
        }

        if (!params.productId) {
            return new NextResponse("Id do produto é obrigatório!", {status: 400})
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

        const product = await prismadb.product.deleteMany({
            where: {
              id: params.productId
            }
          });
        
        return NextResponse.json(product);

    } catch (error) {
        console.log('[PRODUTO_DELETE]', error);
        return new NextResponse("Erro interno", {status: 500})
    }
};