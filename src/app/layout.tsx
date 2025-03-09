"use client";

import { Geist, Geist_Mono } from "next/font/google";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import Link from "next/link";
import "./globals.css";
import { useAuth } from "@/hooks/useAuth";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  useEffect(() => { 
    if (!loading) {
      setIsCheckingAuth(false);
    }
  }, [user, loading, router]);
 
  
  if (isCheckingAuth || loading) {
    return (
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="flex h-screen items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        </body>
      </html>
    );
  }
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
          <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl">
            <div className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <Link
                  href="/"
                  className="text-2xl font-bold tracking-tight hover:text-blue-100 transition-colors"
                >
                  👥 Unow EmployeeHub
                </Link>
              
                <nav className="flex items-center gap-6">
                  {user ? (
                    <Menu as="div" className="relative">
                      <MenuButton className="flex items-center gap-2 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
                        <span className="hidden sm:inline">Mi Perfil</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </MenuButton>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="px-1 py-1">
                            <MenuItem>
                              {({ active }) => (
                                <button
                                  onClick={logout}
                                  className={`${
                                    active
                                      ? "bg-blue-600 text-white"
                                      : "text-gray-900"
                                  } group flex rounded-md items-center w-full px-4 py-2 text-sm transition-colors`}
                                >
                                  Cerrar Sesión
                                </button>
                              )}
                            </MenuItem>
                          </div>
                        </MenuItems>
                      </Transition>
                    </Menu>
                  ) : (
                    <div className="flex gap-4">
                      <Link
                        href="/login"
                        className="px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Ingresar
                      </Link>
                      <Link
                        href="/register"
                        className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
                      >
                        Registrarse
                      </Link>
                    </div>
                  )}
                </nav>
              </div>
            </div>
          </header>

          <main className="flex-1 container mx-auto px-4 py-16">
            {children}
          </main>

          <footer className="border-t border-blue-100 bg-white mt-24">
            <div className="container mx-auto px-4 py-8 text-center">
              <p className="text-sm text-gray-600">
                © 2025 Unow EmployeeHub - Todos los derechos reservados
                <br />
                <span className="text-gray-400">
                  Creado con pasión para equipos extraordinarios
                </span>
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
