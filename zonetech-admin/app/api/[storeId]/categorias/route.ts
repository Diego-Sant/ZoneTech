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
        const {name, billboardId} = body;

        if (!userId) {
            return new NextResponse("Não autenticado!", {status: 401});
        }

        if (!name) {
            return new NextResponse("O nome é obrigatório!", {status: 400})
        }

        if (!billboardId) {
            return new NextResponse("O painel é obrigatória!", {status: 400})
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

        const category = await prismadb.category.create({
            data: {
                name,
                billboardId,
                storeId: params.storeId
            }
        })

        return NextResponse.json(category);

    } catch (error) {
        console.log('[CATEGORIA_POST]', error);
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

        const category = await prismadb.category.findMany({
            where: {
                storeId: params.storeId
            }
        })

        return NextResponse.json(category);

    } catch (error) {
        console.log('[CATEGORIA_GET]', error);
        return new NextResponse("Erro interno", {status: 500})
    }
}