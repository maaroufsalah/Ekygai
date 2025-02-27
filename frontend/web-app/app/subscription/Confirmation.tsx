import { Button } from "flowbite-react";
import { Subscription, UserRegisterDto } from "../types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../actions/authActions";
import { showToast } from "../lib/toastService";
import { signIn } from "next-auth/react";

type Props = {
  subscription: Subscription;
  onBack: () => void;
  onConfirm: () => void;
}

export default function Confirmation({ subscription, onBack, onConfirm }: Props) {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async () => {
    console.log("handleRegister start...");
    setLoading(true);
    setError(null);

    const userDto: UserRegisterDto = {
      planId: subscription.id === "athlete" ? 1 : subscription.id === "coach" ? 2 : subscription.id === "team" ? 3 : 0,
      userName: subscription.user.userName,
      password: subscription.user.password,
      firstName: subscription.user.firstName,
      phoneNumber: subscription.user.phoneNumber,
      lastName: subscription.user.lastName,
      email: subscription.user.email,
      dateOfBirth: subscription.user.dateOfBirth,
      gender: subscription.user.gender,
    };

    console.log("userDto: ", userDto);

    try {
      const response = await registerUser(userDto);
      console.log("response confirmation: ", response);

      if (response.error) {
        const errorMessage = response.error.message?.trim()
          ? response.error.message
          : "Service indisponible. Veuillez réessayer plus tard.";

        showToast(errorMessage, "error");
        setError(errorMessage);
      } else {
        showToast("Inscription réussie!", "success");
        onConfirm();

        // Automatically sign in the user using the token from backend
        const result = await signIn("credentials", {
          redirect: false,
          userNameOrEmail: subscription.user.userName, // or subscription.user.email if you prefer
          password: subscription.user.password,
        });
        router.push("/athletes");
      }
    } catch (error) {
      console.error("Request failed: ", error);
      showToast("Service indisponible. Veuillez réessayer plus tard.", "error");
      setError("Service indisponible. Veuillez réessayer plus tard.");
    }

    setLoading(false);
  };



  return (
    <div className="w-[70%] mx-auto mt-8 p-6 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Confirmation d'inscription</h2>

      <div className="space-y-4">
        <p><strong>Plan:</strong> {subscription.id}</p>
        <p><strong>Frais:</strong> {subscription.price}</p>
        <p><strong>Nom:</strong> {subscription.user.lastName}</p>
        <p><strong>Prénom:</strong> {subscription.user.firstName}</p>
        <p><strong>Email:</strong> {subscription.user.email}</p>
        <p><strong>Téléphone:</strong> {subscription.user.phoneNumber}</p>
        <p><strong>Sexe:</strong> {subscription.user.gender}</p>
        <p>
          <strong>Date naissance:</strong> {new Date(subscription.user.dateOfBirth).toLocaleDateString('fr-FR')}
        </p>
        <p><strong>Nom d'utilisateur:</strong> {subscription.user.userName}</p>
        <p><strong>Mot de passe:</strong> {subscription.user.password}</p>
      </div>

      <div className="flex justify-between mt-6">
        <Button color="gray" onClick={onBack} className="w-1/3">
          Back
        </Button>
        <Button onClick={handleRegister} className="w-1/3 bg-green-500 hover:bg-green-600">
          Confirmer et payer
        </Button>
      </div>
    </div>
  );
}
