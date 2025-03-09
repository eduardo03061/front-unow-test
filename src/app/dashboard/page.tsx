"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { dateFormat, dateFormatInput } from "@/libs/utils";
import { Bounce, ToastContainer, toast } from "react-toastify";

interface Employee {
  _id: string;
  name: string;
  lastName: string;
  dateOfBirth: string;
  isActive: boolean;
  workStation: string;
  isEditing?: boolean;
  email: string;
}

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const [addEmployee, setAddEmployee] = useState(false);
  const [workStations, setWorkStations] = useState([]);
  const [employeeMetrics, setEmployeeMetrics] = useState({});

  const getAllEmployees = async (pageNumber = 1) => {
    let url = `${apiURL}/users?page=${pageNumber}&limit=4`;
    if (search !== "") {
      url += `&search=${search}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    setEmployees(data.employees);
    setTotalPages(data.totalPages);
  };

  const getEmployeesMetrics = async () => {
    const token = localStorage.getItem("refreshToken");
    const response = await fetch(`${apiURL}/users/metrics`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    if (data.statusCode === 401) {
      logout();
    }
    console.log("data", data);
    console.log("user", user);

    setEmployeeMetrics(data);
  };

  const getAllWorkStations = async () => {
    const response = await fetch(`${apiURL}/workstations`);
    const data = await response.json();
    console.log("datass", data);

    setWorkStations(data?.positions);
  };

  useEffect(() => {
    getAllEmployees(page);
  }, [page]);

  useEffect(() => {
    getAllWorkStations();
    getEmployeesMetrics();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (!loading) {
      setIsCheckingAuth(false);
    }
  }, [user, loading, router]);

  const handleSearch = async () => {
    setPage(1);
    getAllEmployees();
  };

  const submitEmployee = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      email: form[0].value,
      name: form[1].value,
      lastName: form[2].value,
      dateOfBirth: form[3].value,
      password: form[4].value,
      workStation: form[5].value,
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
      setAddEmployee(false);
      getAllEmployees();
      getEmployeesMetrics();
      toast.success("Registrado con exito", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const editEmployee = (id) => {
    const _employees = employees.map((item) => {
      if (item._id === id) {
        item.isEditing = true;
      }
      return item;
    });
    setEmployees(_employees);
  };

  const cancelEdit = (id) => {
    const _employees = employees.map((item) => {
      if (item._id === id) {
        item.isEditing = false;
      }
      return item;
    });
    setEmployees(_employees);
  };

  const updateEmployee = async (e, id) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form[0].value,
      lastName: form[1].value,
      workStation: form[2].value,
      dateOfBirth: form[3].value,
      isActive: form[4].value === "Activo" ? true : false,
    };
    const token = localStorage.getItem("refreshToken");
    const response = await fetch(`${apiURL}/users/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (result._id) {
      toast.success("Informacion actualizada con exito", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      const _employees = employees.map((item) => {
        if (item._id === id) {
          return { ...item, ...data, isEditing: false };
        }
        return item;
      });
      setEmployees(_employees);
      getEmployeesMetrics();
    }
  };
  const [modalDelete, setModalDelete] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const deleteEmployee = async (id) => {
    setModalDelete(true);
    setEmployeeId(id);
  };
  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("refreshToken");
      const response = await fetch(`${apiURL}/users/${employeeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.message) {
        getAllEmployees(page);
        getEmployeesMetrics();
        toast.success("Eliminado con exito", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error("Error eliminando empleado:", error);
    } finally {
      setModalDelete(false);
      setEmployeeId(null);
    }
  };

  if (isCheckingAuth || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row">
      {modalDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300 scale-95 animate-scaleIn">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 bg-red-100 rounded-full mb-4">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Confirmar Eliminación
              </h3>
              <p className="text-gray-600">
                ¿Estás seguro de eliminar este empleado?
                <br />
                <span className="text-red-600 font-medium">
                  Esta acción no se puede deshacer.
                </span>
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setModalDelete(false)}
                className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-100 transition-all duration-200 font-medium uppercase text-sm tracking-wide"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 transition-all duration-200 font-medium uppercase text-sm tracking-wide shadow-sm hover:shadow-md"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">
              Bienvenido, {user?.name + " " + user?.lastName}
            </h1>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-600 text-white mr-4">
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Empleados Activos</p>
                  <p className="text-2xl font-bold">
                    {employeeMetrics?.employeesActives}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg border border-red-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-600 text-white mr-4">
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">
                    Empleados dados de baja
                  </p>
                  <p className="text-2xl font-bold">
                    {employeeMetrics?.employeesInactives}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
              <button
                className="flex items-center w-full cursor-pointer"
                onClick={() => setAddEmployee(!addEmployee)}
              >
                <div className="p-3 rounded-full bg-green-600 text-white mr-4">
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Agregar Empleado</p>
                </div>
              </button>
            </div>
          </div>

          {addEmployee && (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Agregar Empleado</h2>
              <form onSubmit={submitEmployee}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nombre
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Apellido
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none placeholder-gray-400"
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
                    <label className="block text-sm font-medium text-gray-700">
                      Contraseña provisional
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Cargo
                    </label>

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
                </div>
                <div className="mt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Agregar
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-red-500 text-white rounded ml-4"
                    onClick={() => setAddEmployee(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-8">
            <h2 className="text-xl font-semibold mb-4">Empleados</h2>

            <div className="flex items-center mb-4">
              <input
                type="text"
                placeholder="Buscar empleado"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none placeholder-gray-400"
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-4"
                onClick={handleSearch}
              >
                Buscar
              </button>
            </div>
            <div className="space-y-4">
              {employees.length > 0 ? (
                employees.map((item, index) =>
                  item.isEditing ? (
                    <div
                      key={index}
                      className="flex items-start pb-4 border-b border-gray-300 bg-yellow-400 rounded-lg p-3"
                    >
                      <div className="bg-blue-100 p-2 rounded-full mr-4">
                        <svg
                          className="h-5 w-5 text-blue-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="w-full">
                        <form onSubmit={(e) => updateEmployee(e, item._id)}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Nombre
                              </label>
                              <input
                                type="text"
                                defaultValue={item.name}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none placeholder-gray-400"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Apellido
                              </label>
                              <input
                                type="text"
                                defaultValue={item.lastName}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none placeholder-gray-400"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Cargo
                              </label>
                              <select
                                defaultValue={item.workStation}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none placeholder-gray-400"
                              >
                                <option value="">Selecciona un cargo</option>
                                {workStations.map((position, index) => (
                                  <option key={index} value={position}>
                                    {position}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Fecha de nacimiento
                              </label>
                              <input
                                type="date"
                                defaultValue={dateFormatInput(item.dateOfBirth)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none placeholder-gray-400"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Estado
                              </label>
                              <select
                                defaultValue={
                                  item.isActive ? "Activo" : "Inactivo"
                                }
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none placeholder-gray-400"
                              >
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button
                              type="submit"
                              className="text-blue-500 pr-5 cursor-pointer"
                            >
                              Guardar
                            </button>
                            <button
                              type="button"
                              className="text-red-500 cursor-pointer"
                              onClick={() => cancelEdit(item._id)}
                            >
                              Cancelar
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={index}
                      className="flex items-start pb-4 border-b border-gray-100"
                    >
                      <div className="bg-blue-100 p-2 rounded-full mr-4">
                        <svg
                          className="h-5 w-5 text-blue-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">
                          {item.name + " " + item.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Cargo: {item.workStation}
                        </p>
                        <p className="text-sm text-gray-500">
                          Fecha de nacimiento: {dateFormat(item.dateOfBirth)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Estado: {item.isActive ? "Activo" : "Inactivo"}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <button
                          className="text-blue-500 pr-5 cursor-pointer"
                          onClick={() => editEmployee(item._id)}
                        >
                          Editar
                        </button>
                        <button
                          className="text-red-500 cursor-pointer"
                          onClick={() => deleteEmployee(item._id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  )
                )
              ) : (
                <div className="text-center text-gray-500">
                  No se encontraron empleados
                </div>
              )}
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <span>
                Página {page} de {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
