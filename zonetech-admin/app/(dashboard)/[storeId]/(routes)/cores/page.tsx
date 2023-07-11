// Componente do Servidor

import { ColorClient } from './componentes/client'

import prismadb from '@/lib/prismadb'
import { ColorColumn } from './componentes/columns';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/esm/locale'

const Color = async ({ params }: {params: {storeId: string}}) => {

  const color = await prismadb.color.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc' // Ordem do mais novo para o mais velho
    }
  });

  const formattedColor: ColorColumn[] = color.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "dd MMM, yyyy - HH:mm", {locale: ptBR})
  }))

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ColorClient data={formattedColor} />
      </div>
    </div>
  )
}

export default Color