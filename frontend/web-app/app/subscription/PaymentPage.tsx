import { Button } from 'flowbite-react';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Input from '../components/Input';  // Assuming you have a reusable Input component
import DateInput from '../components/DateInput';  // Assuming you have a reusable DateInput component

type Props = {
  onNext: () => void;
  onBack: () => void;
};

export default function PaymentPage({ onNext, onBack }: Props) {
  const {
    control,
    handleSubmit,
    setFocus,
    reset,
    formState: { isSubmitting, isValid },
  } = useForm({
    mode: 'onTouched',
  });

  useEffect(() => {
    setFocus('cardNumber');  // Focus on the card number input by default
  }, [setFocus]);

  const onSubmit = (data: any) => {
    // Here we just move to the next step without any payment logic
    onNext(); // Proceed to the next step (Confirmation)
  };

  return (
    <form className="flex flex-col mt-3" onSubmit={handleSubmit(onSubmit)}>
      {/* Input Fields in Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
          label="Nom sur carte"
          name="cardName"
          control={control}
        //   rules={{
        //     required: 'Le numéro de carte est obligatoire',
        //     pattern: {
        //       value: /^\d{16}$/,
        //       message: 'Numéro de carte invalide',
        //     },
        //   }}
        />
        <Input
          label="Numéro de carte"
          name="cardNumber"
          control={control}
        //   rules={{
        //     required: 'Le numéro de carte est obligatoire',
        //     pattern: {
        //       value: /^\d{16}$/,
        //       message: 'Numéro de carte invalide',
        //     },
        //   }}
        />
        <DateInput
          label="Date d’expiration"
          name="expiryDate"
          control={control}
          dateFormat="MM/YY"
        //   rules={{ required: 'La date d’expiration est obligatoire' }}
        />
        <Input
          label="Code de sécurité (CVV)"
          name="cvv"
          control={control}
        //   rules={{
        //     required: 'Le code de sécurité est obligatoire',
        //     pattern: {
        //       value: /^\d{3}$/,
        //       message: 'CVV invalide',
        //     },
        //   }}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-6">
        <Button outline color="gray" type="button" onClick={onBack}>
          Précédent
        </Button>
        <Button type="submit" outline color="success" isProcessing={isSubmitting} disabled={!isValid}>
          Suivant
        </Button>
      </div>
    </form>
  );
}
