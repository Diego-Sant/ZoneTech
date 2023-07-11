// Componente do Servidor

import { BrandClient } from './componentes/client'

import prismadb from '@/lib/prismadb'
import { BrandColumn } from './componentes/columns';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/esm/locale'

const Brand = async ({ params }: {params: {storeId: string}}) => {

  const brand = await prismadb.brand.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc' // Ordem do mais novo para o mais velho
    }
  });

  const formattedBrand: BrandColumn[] = brand.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "dd MMM, yyyy - HH:mm", {locale: ptBR})
  }))

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BrandClient data={formattedBrand} />
      </div>
    </div>
  )
}

export default Brand