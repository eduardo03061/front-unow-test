"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Register() {
  const { login } = useAuth();
  const [workStations, setWorkStations] = useState([]);
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const getAllWorkStations = async () => {
    const response = await fetch(`${apiURL}/workstations`);
    const data = await response.json();

    setWorkStations(data?.positions);
  };

  useEffect(() => {
    getAllWorkStations();
  }, []);

  const submitEmployee = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const data = {
      name: (form[0] as HTMLInputElement).value,
      lastName: (form[1] as HTMLInputElement).value,
      email: (form[2] as HTMLInputElement).value,
      password: (form[3] as HTMLInputElement).value,
      dateOfBirth: (form[4] as HTMLInputElement).value,
      workStation: (form[5] as HTMLInputElement).value,
    };
    const response = await fetch(`${apiURL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.user) {
      await login(result);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 sm:p-12">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido</h2>
        <p className="text-gray-600">Ingresa la información para registrarte</p>
      </div>

      <form className="space-y-6" onSubmit={submitEmployee}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none placeholder-gray-400"
              placeholder="Eduardo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apellido
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none placeholder-gray-400"
              placeholder="Hernandez"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correo Electrónico
          </label>
          <input
            type="email"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none placeholder-gray-400"
            placeholder="eduardo.hernandez@unow.es"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <input
            type="password"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none placeholder-gray-400"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha de nacimiento
          </label>
          <input
            type="date"
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none placeholder-gray-400"
          />
        </div>
        <div>
          <label htmlFor="worstation">Puesto de trabajo</label>
          <select
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none placeholder-gray-400"
          >
            <option value="">Selecciona un cargo</option>
            {workStations.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          Registrar Cuenta
        </button>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Inicia Sesión aquí
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
