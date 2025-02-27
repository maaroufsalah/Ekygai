'use client'

import { Button } from 'flowbite-react'
import { useRouter } from 'next/navigation';
import React from 'react'

export default function RegisterButton() {

  const router = useRouter();

  return (
    <Button gradientMonochrome="cyan"
      onClick={() => router.push('/subscription')}
    >
      Inscription
    </Button>
  )
}
