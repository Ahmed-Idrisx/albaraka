import { EditProduct } from "@/features/products/components/EditProduct";

export default async function Page({
  params,
}: PageProps<"/dashboard/products/[id]">) {
  const { id } = await params;
  return <EditProduct id={id} />;
}
