import { Button, Card } from "flowbite-react";

export default function ConnectDevice() {
  return (
    <div className="">
      <Card className="bg-white p-4 rounded-lg shadow-md">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Terminez la configuration de votre compte
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          Connectez des applications et des appareils
          Téléchargez vos séances d'entraînement directement dans TrainingPeaks avec vos comptes d'application ou d'appareil existants.
        </p>
        <Button>
          Connecter
          <svg className="-mr-1 ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </Card>
    </div>

  );
}
