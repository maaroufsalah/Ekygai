"use client";

import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";

export default function LoginButton() {
  const router = useRouter();

  return (
    <Button
      outline
      gradientDuoTone="cyanToBlue"
      onClick={() => router.push("/auth/signin")}
    >
      Se connecter
    </Button>
  );
}
