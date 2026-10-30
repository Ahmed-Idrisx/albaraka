import { Suspense } from "react";
import { ProductsCatalog } from "@/features/products/components/ProductsCatalog";

export default function Page() {
  return (
    <Suspense>
      <ProductsCatalog />
    </Suspense>
  );
}
