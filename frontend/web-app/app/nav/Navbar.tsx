"use client";

import React from 'react';
import Logo from './Logo';
import LoginButton from './LoginButton';
import RegisterButton from './RegisterButton';
import Link from 'next/link';
import UserActions from './UserActions';
import { useSession } from 'next-auth/react';

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <header className="sticky top-0 z-50 flex justify-between bg-white p-5 items-center text-gray-800 shadow-md">
            <Logo />

            <nav className="flex space-x-6 mx-auto">
                <Link href="/athletes" className="hover:text-blue-500 font-medium">
                    Performance
                </Link>
                <Link href="/calendar" className="hover:text-blue-500 font-medium">
                    Calendrier
                </Link>
                <Link href="/dashboard" className="hover:text-blue-500 font-medium">
                    Dashboard
                </Link>
            </nav>

            <div className="flex space-x-4 ml-auto">
                {session?.user ? (
                    <UserActions user={session.user} />
                ) : (
                    <>
                        <LoginButton />
                        <RegisterButton />
                    </>
                )}
            </div>
        </header>
    );
}
