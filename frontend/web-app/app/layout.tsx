import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./nav/Navbar";
import Footer from "./footer/Footer";
import { Toaster } from "react-hot-toast";
import { Providers } from "./providers";

// Initialize Stripe with your public key
// const stripePromise = loadStripe("your-public-key-here");

export const metadata: Metadata = {
  title: "Training App",
  description: "Training App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Providers>
          <Navbar />
          <main className="container mx-auto px-5 pt-10 flex-grow">
            {/* Wrap children with Elements provider */}
            {/* <Elements stripe={stripePromise}> */}
            <Toaster position="bottom-right" />

            {children}
            {/* </Elements> */}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
