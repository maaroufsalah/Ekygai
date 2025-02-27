'use client'

import { Card, Button, Modal } from "flowbite-react";
import { useState } from "react";
import { Subscription } from "../types";
import { useRouter } from "next/navigation";

const plans = [
  {
    id: "athlete",
    name: "Athlète",
    price: "49",
    features: [
      { text: "3 plans d'entraînement", available: true },
      { text: "Bibliothèque d'exercices avancée", available: true },
      { text: "Suivi des progrès", available: true },
      { text: "Conseils nutritionnels", available: true },
      { text: "Plans d'entraînement premium", available: false },
      { text: "Coaching personnalisé", available: false },
      { text: "Coaching personnalisé pour l'équipe", available: false }
    ],
  },
  {
    id: "coach",
    name: "Entraîneur",
    price: "99",
    features: [
      { text: "Plans d'entraînement illimités", available: true },
      { text: "Bibliothèque d'exercices complète", available: true },
      { text: "Suivi des progrès avancé", available: true },
      { text: "Conseils nutritionnels", available: true },
      { text: "Plans d'entraînement premium", available: true },
      { text: "Coaching personnalisé", available: true },
      { text: "Coaching personnalisé pour l'équipe", available: false }
    ],
  },
  {
    id: "team",
    name: "Équipe",
    price: "199",
    features: [
      { text: "Accès pour 5 membres de l'équipe", available: true },
      { text: "Plans d'entraînement pour l'équipe", available: true },
      { text: "Bibliothèque d'exercices complète", available: true },
      { text: "Suivi des progrès avancé", available: true },
      { text: "Conseils nutritionnels", available: true },
      { text: "Plans d'entraînement premium", available: true },
      { text: "Coaching personnalisé pour l'équipe", available: true },
    ],
  },
];

interface PlanSelectionProps {
  onSelect: (id: Subscription["id"]) => void;
  onNext: () => void;
}

export default function PlanSelection({ onSelect, onNext }: PlanSelectionProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    id: string;
    name: string;
    price: string;
    features: { text: string; available: boolean }[];
  } | null>(null);

  const router = useRouter();

  const openModal = (plan: typeof plans[0]) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
  };

  const handleSelect = (planId: Subscription["id"]) => {
    onSelect(planId);
    onNext();
  };

  const handleDetailsRedirect = () => {
    if (selectedPlan) {
      router.push(`/detailsForm/${selectedPlan.id}`);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {plans.map((plan) => (
 <Card key={plan.id} className="max-w-sm">
 <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
   {plan.name}
 </h5>
 <div className="flex items-baseline text-gray-900 dark:text-white">
   <span className="text-3xl font-semibold">DH</span>
   <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
   <span className="text-3xl font-semibold">/mois</span>
 </div>
 <ul className="my-7 space-y-5">
   {plan.features.map((feature, index) => (
     <li 
       key={index} 
       className={`flex space-x-3 ${!feature.available ? 'line-through decoration-gray-500' : ''}`}
     >
       <svg
         className={`h-5 w-5 shrink-0 ${
           feature.available 
             ? 'text-cyan-600 dark:text-cyan-500' 
             : 'text-gray-400 dark:text-gray-500'
         }`}
         fill="currentColor"
         viewBox="0 0 20 20"
         xmlns="http://www.w3.org/2000/svg"
       >
         <path
           fillRule="evenodd"
           d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
           clipRule="evenodd"
         />
       </svg>
       <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
         {feature.text}
       </span>
     </li>
   ))}
 </ul>
 <div className="space-y-4">
   <button
     type="button"
     onClick={() => handleSelect(plan.id)}
     className="inline-flex w-full justify-center rounded-lg bg-cyan-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-900"
   >
     Choisir {plan.name}
   </button>
   <button
     type="button"
     onClick={() => openModal(plan)}
     className="inline-flex w-full justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
   >
     Détails
   </button>
 </div>
</Card>
        
        ))}
      </div>

      <Modal show={showModal} onClose={closeModal}>
        <Modal.Header>
          {selectedPlan?.name} - {selectedPlan?.price}
        </Modal.Header>
        <Modal.Body>
          <p className="text-lg font-medium">Caractéristiques :</p>
          <ul className="mt-2 list-disc list-inside">
            {selectedPlan?.features.map((feature, index) => (
              <li key={index}>{feature.text}</li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={closeModal} outline gradientDuoTone="cyanToBlue">
            Fermer
          </Button>
          <Button onClick={handleDetailsRedirect} gradientMonochrome="info">
            Aller aux Détails
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}