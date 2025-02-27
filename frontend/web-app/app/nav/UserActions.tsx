'use client'

import { Dropdown, DropdownDivider, DropdownItem } from 'flowbite-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { AiOutlineLogout } from 'react-icons/ai'
import { HiCog, HiUser } from 'react-icons/hi'

type Props = {
  user: {
    name?: string | null;  // ✅ Allow `null` values
    email?: string | null; // ✅ Allow `null` values
    username: string; // ✅ Ensure `username` is required
  };
}

export default function UserActions({ user }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Dropdown inline label={`Bienvenue ${user.name ?? user.username}`}>
      <DropdownItem icon={HiUser}>
          Mon profile
      </DropdownItem>

      <DropdownItem icon={HiCog}>
        <Link href='/session'>
          Session (dev only!)
        </Link>
      </DropdownItem>

      <DropdownDivider />

      <DropdownItem icon={AiOutlineLogout} onClick={() => signOut({callbackUrl: '/'})}>
        Se déconnecter
      </DropdownItem>
    </Dropdown>
  );
}
