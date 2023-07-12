// Componente do Servidor

import { ProductClient } from './componentes/client'

import { formatter } from '@/lib/utils';
import prismadb from '@/lib/prismadb'

import { ProductColumn } from './componentes/columns';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/esm/locale'

const Products = async ({ params }: {params: {storeId: string}}) => {

  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      category: true,
      brands: true,
      colors: true,
    },
    orderBy: {
      createdAt: 'desc' // Ordem do mais novo para o mais velho
    }
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchiverd: item.isArchived,
    price: formatter.format(item.price.toNumber()),
    category: item.category.name,
    brands: item.brands.name,
    colors: item.colors.name,
    createdAt: format(item.createdAt, "dd MMM, yyyy - HH:mm", {locale: ptBR})
  }))

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  )
}

export default Products