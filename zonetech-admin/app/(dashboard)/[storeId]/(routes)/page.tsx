import { getGraphRevenue } from "@/actions/getGraphRevenue"
import { getSalesCount } from "@/actions/getSalesCount"
import { getStockCount } from "@/actions/getStockCount"
import { getTotalRevenue } from "@/actions/getTotalRevenue"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import Overview from "@/components/ui/overview"
import { Separator } from "@/components/ui/separator"

import { formatter } from "@/lib/utils"

import { CreditCard, Package } from "lucide-react"

interface DashBoardPageProps {
  params: { storeId: string }
}

const DashboardPage: React.FC<DashBoardPageProps> = async ({ params }) => {
  const totalRevenue = await getTotalRevenue(params.storeId)
  const salesCount = await getSalesCount(params.storeId);
  const stockCount = await getStockCount(params.storeId);
  const graphRevenue = await getGraphRevenue(params.storeId);
  
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Menu principal" description="Veja seu painel de controle" />
        <Separator />
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Card>
            <CardHeader className="text-md font-medium flex flex-row justify-between">
                Valor Total
                <div className="flex text-md font-semibold text-muted-foreground">
                  <span className="ml-1">R$</span>
                </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatter.format(totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="text-md font-medium flex flex-row justify-between">
                Vendas
                <div className="flex text-md font-semibold text-muted-foreground">
                  <CreditCard size={20} />
                </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +{salesCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="text-md font-medium flex flex-row justify-between">
                Em estoque
                <div className="flex text-md font-semibold text-muted-foreground">
                  <Package size={20} />
                </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stockCount}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="mb-4">Visão geral</CardTitle>
            <CardContent className="pl-2">
              <Overview data={graphRevenue} />
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage