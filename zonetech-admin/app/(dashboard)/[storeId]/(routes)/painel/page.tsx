// Componente do Servidor

import { BillboardClient } from './componentes/client'

import prismadb from '@/lib/prismadb'
import { BillboardColumn } from './componentes/columns';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/esm/locale'

const Billboards = async ({ params }: {params: {storeId: string}}) => {

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc' // Ordem do mais novo para o mais velho
    }
  });

  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "dd MMM, yyyy - HH:mm", {locale: ptBR})
  }))

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  )
}

export default Billboards