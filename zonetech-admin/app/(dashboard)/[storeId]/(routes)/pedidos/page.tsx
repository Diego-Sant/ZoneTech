// Componente do Servidor

import { OrderClient } from './componentes/client'

import prismadb from '@/lib/prismadb'
import { OrderColumn } from './componentes/columns';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/esm/locale'
import { formatter } from '@/lib/utils';

const Order = async ({ params }: {params: {storeId: string}}) => {

  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc' // Ordem do mais novo para o mais velho
    }
  });

  const formattedOrder: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems.map((orderItem) => orderItem.product.name).join(', '),
    totalPrice: formatter.format(item.orderItems.reduce((total, item) => {
      return total + Number(item.product.price)
    }, 0)), // Pega o valor total(que é 0 por padrão e adiciona o valor dos produtos adicionados)
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, "dd MMM, yyyy - HH:mm", {locale: ptBR})
  }))

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <OrderClient data={formattedOrder} />
      </div>
    </div>
  )
}

export default Order