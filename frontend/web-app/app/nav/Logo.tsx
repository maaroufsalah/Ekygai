'use client'

import Image from 'next/image';
// import { useParamsStore } from '@/hooks/useParamsStore'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { FcSportsMode } from "react-icons/fc";

export default function Logo() {
    const router = useRouter();
    const pathname = usePathname();

    function doReset() {
        if (pathname !== '/') router.push('/');
        // reset();
    }
    // const reset = useParamsStore(state => state.reset);

    return (
        <div
            onClick={doReset}
            className="cursor-pointer flex items-center gap-2 text-3xl font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent"
        >
            <Image src="/logo.jpeg" alt='logo' width={150} height={150} />
        </div>
    )
}
