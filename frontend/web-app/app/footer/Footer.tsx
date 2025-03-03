import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-6 mt-auto">
            <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between">
                <p className="text-sm sm:text-base font-semibold">
                    Prêt à commencer votre aventure sportive ?
                </p>
                <Link href="#">
                    <button className="mt-4 sm:mt-0 bg-white text-cyan-500 px-6 py-2 rounded-full font-semibold hover:bg-gray-100">
                        Rejoignez-nous
                    </button>
                </Link>
                <div className="text-xs sm:text-sm text-gray-200 mt-4 sm:mt-0">
                    &copy; 2025 Training App. Tous droits réservés.
                </div>
            </div>
        </footer>
    );
}
