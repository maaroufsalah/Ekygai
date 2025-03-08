import React from "react";
import Link from "next/link";
import Footer from "../footer/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Section Héro */}
      <section className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold">
            Suivez, connectez et améliorez vos performances
          </h1>
          <p className="mt-4 text-lg md:text-xl">
            Ekygai – Trouvez votre équilibre, atteignez l'excellence grâce à la science et l'IA
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <Link href="#">
              <button className="bg-white text-cyan-500 px-6 py-3 rounded-full font-semibold shadow-md hover:bg-gray-100">
                Commencer
              </button>
            </Link>
            <Link href="#">
              <button className="border border-white px-6 py-3 rounded-full font-semibold hover:bg-blue-600">
                En savoir plus
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Coming Soon */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-blue-500">
            Coming Soon
          </h1>
          <div className="w-48 h-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-10"></div>
        </div>
      </section>

    </div>
  );
}
