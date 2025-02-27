'use client'

import MultiStepSubscription from "../subscription/Subscription";

export default function SubscriptionPage() {
  return (
    <div>
      <h1 className="text-center cursor-pointer text-3xl font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
        Choisir un plan
      </h1>
      <MultiStepSubscription />
    </div>
  );
}
