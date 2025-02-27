
"use client";

import { Card } from "flowbite-react";
import Image from "next/image";

export default function Performance() {
  return (
    <Card className="bg-white p-4 rounded-lg shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Preformance</h5>
        <a href="#" className="text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-500">
          Afficher tous
        </a>
      </div>
      <div className="flow-root">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          <li className="py-3 sm:py-4">
            <div className="flex items-center space-x-4">
              <div className="shrink-0">
                <Image
                  alt="Neil image"
                  height="32"
                  src="https://cdn.pixabay.com/photo/2012/11/28/11/11/football-67701_960_720.jpg"
                  width="32"
                  className="rounded-full"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">Taille</p>
                <p className="truncate text-sm text-gray-500 dark:text-gray-400">test</p>
              </div>
              <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">65kg</div>
            </div>
          </li>
          <li className="py-3 sm:py-4">
            <div className="flex items-center space-x-4">
              <div className="shrink-0">
                <Image
                  alt="Bonnie image"
                  height="32"
                  src="https://cdn.pixabay.com/photo/2012/11/28/11/11/football-67701_960_720.jpg"
                  width="32"
                  className="rounded-full"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">Hauteur</p>
                <p className="truncate text-sm text-gray-500 dark:text-gray-400"></p>
              </div>
              <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                176cm
              </div>
            </div>
          </li>
          <li className="py-3 sm:py-4">
            <div className="flex items-center space-x-4">
              <div className="shrink-0">
                <Image
                  alt="Michael image"
                  height="32"
                  src="https://cdn.pixabay.com/photo/2012/11/28/11/11/football-67701_960_720.jpg"
                  width="32"
                  className="rounded-full"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">test</p>
                <p className="truncate text-sm text-gray-500 dark:text-gray-400">test</p>
              </div>
              <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">test</div>
            </div>
          </li>
        </ul>
      </div>
    </Card>
  );
}
