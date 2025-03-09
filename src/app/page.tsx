import Link from "next/link"

export default function Home() {
  return ( 
      <div className="max-w-4xl mx-auto text-center">
      <div className="mb-12">
        <h2 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
          Transforma tu Gestión de Personal
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Optimiza el control de tu equipo humano con nuestra plataforma todo-en-uno. 
          Accede a herramientas inteligentes para administrar toda la información de tus colaboradores.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
        <Link 
          href="/dashboard"
          className="w-full sm:w-56 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          Ir al Dashboard
        </Link>
      </div>
    </div> 
  )
}