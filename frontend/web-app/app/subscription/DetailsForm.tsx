import { Button } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Input from '../components/Input';
import DateInput from '../components/DateInput';
import { User } from '../types';
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";

type Props = {
  user: User;
  onDetailsChange: (user: User) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function DetailsForm({ user, onDetailsChange, onNext, onBack }: Props) {
  const {
    control,
    handleSubmit,
    setFocus,
    reset,
    formState: { isSubmitting, isValid, isDirty }, // Track isDirty to ensure form interaction
  } = useForm<FieldValues>({
    mode: 'onTouched', // Ensure validation happens when fields are touched
  });

  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  useEffect(() => {
    if (user) {
      const { lastName, firstName, email, phoneNumber, dateOfBirth, gender, userName, password } = user;
      reset({ lastName, firstName, email, phoneNumber, dateOfBirth, gender, userName, password });
    }
    setFocus('lastName');
  }, [setFocus, user, reset]);

  const onSubmit: SubmitHandler<FieldValues> = async (data: FieldValues) => {
    // Map the data to User type manually
    const userData: User = {
      lastName: data.lastName,
      firstName: data.firstName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      userName: data.userName,
      password: data.password,
    };

    onDetailsChange(userData); // Save the details
    onNext(); // Move to the next step (confirm)
  };

  return (
    <form className="flex flex-col mt-3" onSubmit={handleSubmit(onSubmit)}>
      {/* Input Fields in Two Columns */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Nom"
          name="lastName"
          control={control}
          rules={{ required: 'Le nom est obligatoire' }}
        />
        <Input
          label="Prénom"
          name="firstName"
          control={control}
          rules={{ required: 'Le prénom est obligatoire' }}
        />

        <Input
          label="Nom d'utilisateur"
          name="userName"
          control={control}
          rules={{ required: "Le nom d'utilisateur est obligatoire" }}
        />
        {/* Password Field with Toggle Button */}
        <div className="relative">
          <Input
            label="Mot de passe"
            name="password"
            control={control}
            type={showPassword ? "text" : "password"}
            rules={{
              required: 'Le mot de passe est obligatoire',
              minLength: {
                value: 6,
                message: 'Le mot de passe doit contenir au moins 6 caractères',
              },
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <FaRegEyeSlash className="w-5 h-5" /> : <FaRegEye className="w-5 h-5" />}
          </button>
        </div>
        {/* <Input
          label="Mot de passe"
          name="password"
          control={control}
          rules={{
            required: 'Le mot de passe est obligatoire',
            minLength: {
              value: 6,
              message: 'Le mot de passe doit contenir au moins 6 caractères',
            },
          }}
        /> */}

        <Input
          label="Email"
          name="email"
          control={control}
          rules={{
            required: "L'email est obligatoire",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: 'Adresse email invalide',
            },
          }}
        />
        <Input
          label="Numéro de téléphone"
          name="phoneNumber"
          control={control}
          rules={{
            required: 'Le numéro de téléphone est obligatoire',
            pattern: {
              value: /^[0-9]{10}$/,
              message: 'Numéro de téléphone invalide (10 chiffres requis)',
            },
          }}
        />
               
        <DateInput
          label="Date de naissance"
          name="dateOfBirth"
          control={control}
          dateFormat="dd MMMM yyyy"
          rules={{ required: 'La date de naissance est obligatoire' }}
        />

        <Controller
          name="gender"
          control={control}
          rules={{ required: 'Le sexe est obligatoire' }}
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-1">
              <select
                id="gender"
                {...field}
                className={`w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none 
                  ${fieldState.error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
              >
                <option value="">Sexe</option>
                <option value="Male">Masculin</option>
                <option value="Female">Féminin</option>
              </select>
              {fieldState.error && (
                <span className="text-red-500 text-sm">{fieldState.error.message}</span>
              )}
            </div>
          )}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-6">
        <Button outline color="gray" type="button" onClick={onBack}>
          Précédent
        </Button>
        <Button
          type="submit"
          outline
          color="success"
          isProcessing={isSubmitting}
          disabled={!isValid || !isDirty} // Disabled if form is invalid or not touched
        >
          Suivant
        </Button>
      </div>
    </form>
  );
}
