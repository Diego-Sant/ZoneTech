// Componente do Servidor

import { CategoryClient } from './componentes/client'

import prismadb from '@/lib/prismadb'
import { CategoryColumn } from './componentes/columns';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/esm/locale'

const Categories = async ({ params }: {params: {storeId: string}}) => {

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: 'desc' // Ordem do mais novo para o mais velho
    }
  });

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, "dd MMM, yyyy - HH:mm", {locale: ptBR})
  }))

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  )
}

export default Categories