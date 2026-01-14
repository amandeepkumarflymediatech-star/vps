import { Suspense } from "react";
import UpiContent from "./UpiContent";

export default function UpiPaymentPage() {
  return (
    <Suspense fallback={<div>Loading UPI Gateway...</div>}>
      <UpiContent />
    </Suspense>
  );
}