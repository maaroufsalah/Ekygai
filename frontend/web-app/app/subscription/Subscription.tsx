import { useState } from "react";
import Confirmation from "./Confirmation";
import { Subscription, User } from "../types";
import DetailsForm from "./DetailsForm";
import PaymentPage from "./PaymentPage"; // Import PaymentPage component
import PlanSelection from "./PlanSelection";

const MultiStepSubscription = () => {
  const [step, setStep] = useState(1);
  const [subscription, setSubscription] = useState<Subscription>({
    id: "free",
    price: "",
    features: [],
    user: {
      lastName: "",
      firstName: "",
      email: "",
      userName: "",
      password: "",
      dateOfBirth: "",
      gender: "",
      phoneNumber : ""
    }
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleConfirm = () => {
    console.log("Subscription Confirmed:", subscription);
    // Add payment or API logic here
  };

  return (
    <div className="p-6">
      {step === 1 && (
        <PlanSelection
          onSelect={(id: any) => setSubscription({ ...subscription, id })}
          onNext={nextStep}
        />
      )}
      {step === 2 && (
        <DetailsForm
          user={subscription.user}
          onDetailsChange={(user: User) => setSubscription({ ...subscription, user })}
          onNext={nextStep}
          onBack={prevStep}
        />
      )}
      {step === 3 && (
        <PaymentPage
          onNext={nextStep}
          onBack={prevStep}
        /> // Add PaymentPage step here
      )}
      {step === 4 && (
        <Confirmation
          subscription={subscription}
          onBack={prevStep}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
};

export default MultiStepSubscription;
