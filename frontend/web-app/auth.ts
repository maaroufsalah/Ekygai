import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                userNameOrEmail: { label: "UserNameOrEmail", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) return null;
                // Make your login request to your API
                console.log("credentials : ", credentials);
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/login`, {
                    method: "POST",
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" },
                });

                // Parse the response once
                const data = await res.json().catch(() => ({}));
                // data might look like: { succeeded: false, message: "Le nom d'utilisateur...", data: null }
                if (!res.ok || !data.succeeded || !data.data?.token) {
                    throw new Error(data.message || "Le nom d'utilisateur ou mot de passe invalides. Merci de réessayer");
                }
            
                return {
                    id: data.data.id,
                    name: data.data.fullName || data.data.userName, // Use full name if available
                    username: data.data.userName,
                    email: data.data.email,
                    accessToken: data.data.token, // Access token correctly
                };
            },
        }),
    ],
    callbacks: {
        // Attach user data to the JWT token
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.name = user.name;
                token.email = user.email;
                token.username = user.username;
            }
            return token;
        },
        // Make user data available in the session
        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            session.user = {
                name: token.name,
                email: token.email,
                username: token.username,
            };
            return session;
        },
    },
    pages: {
        signIn: "/signin", // Custom sign-in page
    },
    // Make sure you have a secret set for production
    secret: process.env.NEXTAUTH_SECRET,
};
