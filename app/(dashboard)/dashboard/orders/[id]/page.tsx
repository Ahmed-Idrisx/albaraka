import { OrderDetails } from "@/features/orders/components/OrderDetails";

export default async function Page({
  params,
}: PageProps<"/dashboard/orders/[id]">) {
  const { id } = await params;
  return <OrderDetails id={id} />;
}
