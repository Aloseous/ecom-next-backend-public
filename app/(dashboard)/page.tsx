import SalesChart from "@/components/customUI/SalesChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCustomers, getSales, getSalesPerMonth } from "@/lib/actions/action";
import { IndianRupee, ShoppingBasket, Users } from "lucide-react";


export default async function Home() {

  const totalRevenue = await getSales().then((res) => res.totalRevenue);
  const totalOrders = await getSales().then((res) => res.totalOrders);
  const totalCustomers = await getCustomers();
  const graphData = await getSalesPerMonth();


  return (
    <div className="px-8 py-10">
      <p className="text-heading2-bold">Dashboard</p>
      <Separator className="bg-grey-1 my-5" />
      <div className="grid grid-cols-2 gap-10 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Total Revenue</CardTitle>
            <IndianRupee className="max-sm:hidden" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold">{totalRevenue} ₹</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Total Customers</CardTitle>
            <Users className="max-sm:hidden" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold">{totalCustomers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Total Orders</CardTitle>
            <ShoppingBasket className="max-sm:hidden" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold">{totalOrders}</p>
          </CardContent>
        </Card>

      </div>
      <Card>
        <CardHeader className="mt-10">
          <CardTitle>Sales chart</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesChart data={graphData} />
        </CardContent>
      </Card>
    </div>
  );
}
