// Componente do Servidor

import prismadb from "@/lib/prismadb";

import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { SettingsForm } from "./componentes/settingsForm";

interface SettingsPageProps {
    params: {
        storeId: string;
    }
}

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {
    const {userId} = auth();

    // Se o id não for reconhecido, manda de volta para o login
    if (!userId) {
        redirect("/entrar")
    }

    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId
        }
    })

    // Se o id for inválido antes do /configuracoes, ele irá voltar o menu inicial
    if (!store) {
        redirect("/"); // Também foi necessário colocar esse tipo de proteção pois o arquivo initialData poderia dar erro dizendo que store poderia ser undefined
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SettingsForm initialData={store} />
            </div>
        </div>
  )
}

export default SettingsPage