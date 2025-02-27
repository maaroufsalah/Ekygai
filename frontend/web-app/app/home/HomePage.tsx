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
            Rejoignez des millions d'athlètes et de passionnés qui repoussent leurs limites.
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <Link href="/subscription">
              <button className="bg-white text-cyan-500 px-6 py-3 rounded-full font-semibold shadow-md hover:bg-gray-100">
                Commencer
              </button>
            </Link>
            <Link href="/about">
              <button className="border border-white px-6 py-3 rounded-full font-semibold hover:bg-blue-600">
                En savoir plus
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Fonctionnalités */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Pourquoi nous choisir ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Fonctionnalité 1 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 mx-auto">
                <img
                  src="https://cdn.pixabay.com/photo/2015/12/07/10/24/go-kart-1080492_1280.jpg"
                  alt="Suivi d'activité"
                  className="w-24 h-24 object-cover rounded-full"
                />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Suivi d'activité</h3>
              <p className="mt-4 text-gray-600">
                Enregistrez vos courses, balades, séances de natation et bien plus avec des analyses détaillées.
              </p>
            </div>

            {/* Fonctionnalité 2 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 mx-auto">
                <img
                  src="https://cdn.pixabay.com/photo/2012/11/28/11/11/football-67701_960_720.jpg"
                  alt="Soutien communautaire"
                  className="w-24 h-24 object-cover rounded-full"
                />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Soutien communautaire</h3>
              <p className="mt-4 text-gray-600">
                Connectez-vous avec d'autres athlètes, rejoignez des défis et partagez vos progrès.
              </p>
            </div>

            {/* Fonctionnalité 3 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 mx-auto">
                <img
                  src="https://cdn.pixabay.com/photo/2018/08/29/09/12/business-3639453_960_720.jpg"
                  alt="Informations sur les performances"
                  className="w-24 h-24 object-cover rounded-full"
                />
              </div>
              <h3 className="mt-6 text-xl font-semibold">
                Informations sur les performances
              </h3>
              <p className="mt-4 text-gray-600">
                Analysez vos entraînements et obtenez de meilleurs résultats.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
