import { Suspense } from "react";
import SuccessContent from "./SuccessContent";

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-earth-50 min-h-screen pt-28 px-6">
          <div className="max-w-lg mx-auto py-20 text-center">
            <p className="font-serif text-3xl text-earth-900">Loading…</p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
