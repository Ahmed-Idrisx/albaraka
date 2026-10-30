import { ProductDetails } from "@/features/products/components/ProductDetails";

export default async function Page({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  return <ProductDetails slug={slug} />;
}
