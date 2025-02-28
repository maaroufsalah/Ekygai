import { authOptions } from "@/auth"; // ✅ Ensure correct import
import { fetchWrapper } from "../lib/fetchWrapper";
import { UserRegisterDto } from "../types";
import { getServerSession } from "next-auth";

export async function registerUser(user: UserRegisterDto) {
    try {
        console.log("user :", user);
        const response = await fetchWrapper.post('auth/register', user);
        console.log("response : ", response);
        return response;
    } catch (error) {
        console.log("error : ", error);
        console.error("Registration failed:", error);
        return { error: "L'enregistrement a échoué. Veuillez réessayer." };
    }
}

export async function getCurrentUser() {
    try {
        console.log("authOptions : ", authOptions);
        const session = await getServerSession(authOptions); // ✅ Correct function usage
        console.log("session : ", session);

        if (!session || !session.user) return null;

        return session.user;
    } catch (error) {
        console.error("Error fetching user session:", error);
        return null;
    }
}
