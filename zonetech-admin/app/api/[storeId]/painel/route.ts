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
        const {label, imageUrl} = body;

        if (!userId) {
            return new NextResponse("Não autenticado!", {status: 401});
        }

        if (!label) {
            return new NextResponse("O campo é obrigatório!", {status: 400})
        }

        if (!imageUrl) {
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
            return new NextResponse("Não autorizado!", { status: 403 })
        }

        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            }
        })

        return NextResponse.json(billboard);

    } catch (error) {
        console.log('[PAINEL_POST]', error);
        return new NextResponse("Erro interno", {status: 500})
    }
}

export async function GET(
    req: Request,
    { params }: {params: {storeId: string}} // storeId vem da pasta [storeId] que vem antes desse componente
) {
    try {

        if (!params.storeId) {
            return new NextResponse("O Id da loja é obrigatório!", {status: 400})
        }

        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId
            }
        })

        return NextResponse.json(billboards);

    } catch (error) {
        console.log('[PAINEL_GET]', error);
        return new NextResponse("Erro interno", {status: 500})
    }
}