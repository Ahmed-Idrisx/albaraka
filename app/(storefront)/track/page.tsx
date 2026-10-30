import { Suspense } from "react";
import { TrackOrder } from "@/features/orders/components/TrackOrder";

export default function Page() {
  return (
    <Suspense>
      <TrackOrder />
    </Suspense>
  );
}
