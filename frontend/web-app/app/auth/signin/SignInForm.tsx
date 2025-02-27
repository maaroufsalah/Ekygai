"use client";

import { Button } from "flowbite-react";
import { useForm, SubmitHandler, Controller, FieldValues } from "react-hook-form";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import Input from "@/app/components/Input";
import { showToast } from "@/app/lib/toastService";

export default function SignInForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    // Set up react-hook-form
    const {
        control,
        handleSubmit,
        formState: { isSubmitting, isValid, isDirty },
    } = useForm<FieldValues>({
        mode: "onTouched", // Validate fields on touch
    });

    // Handle form submission
    const onSubmit: SubmitHandler<FieldValues> = async (data: FieldValues) => {
        // Attempt sign in with NextAuth Credentials provider
        const result = await signIn("credentials", {
            userNameOrEmail: data.userNameOrEmail,
            password: data.password,
            redirect: false, // We will handle the redirect ourselves
        });
        console.log("result : ", result);
        if (result?.ok) {
            showToast("Connexion réussie!", "success");
            router.push("/athletes");
            router.refresh();
        } else {
            console.error("Error: ", result?.error);
            showToast(result?.error ?? "Erreur de connexion", "error");
        }
    };

    return (
        <form
            className="w-[70%] mx-auto mt-8 p-6 border rounded-lg shadow-lg"
            onSubmit={handleSubmit(onSubmit)}
        >
            {/* <h2 className="text-2xl font-bold text-center mb-4">Se connecter</h2> */}

            <div className="space-y-4">
                {/* Username Field */}
                <Input
                    label="Nom d'utilisateur"
                    name="userNameOrEmail"
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
                            required: "Le mot de passe est obligatoire",
                            minLength: {
                                value: 6,
                                message: "Le mot de passe doit contenir au moins 6 caractères",
                            },
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                    >
                        {showPassword ? (
                            <FaRegEyeSlash className="w-5 h-5" />
                        ) : (
                            <FaRegEye className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>

            <div className="flex justify-center mt-6">
                <Button
                    type="submit"
                    outline
                    color="success"
                    isProcessing={isSubmitting}
                    disabled={!isValid || !isDirty}
                >
                    Se connecter
                </Button>
            </div>
        </form>
    );
}
