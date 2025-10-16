
import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
//import { Link, useNavigate } from "react-router";
import { apiService } from "../../service/api"; //Importe de servicio
import { useAuth } from "../../context/AuthContext"; // Importa el hook de autenticación
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";


export default function SignInForm() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useAuth(); // Obtiene la función para actualizar el usuario
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña
  const [isChecked, setIsChecked] = useState(false); // Estado para "Keep me logged in"

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await apiService.post<{ user: any }>('/auth/login', {
        usuario,
        contrasena,
      });

      setUser(response.user); // Actualiza el estado global
      navigate('/TailAdmin/'); // Redirige al dashboard
    } catch (err: any) {
      setError(err.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    }
  };


  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Iniciar Sesion
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ingresa tu usuario y contraseña!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/*  usuario */}
              <div>
                  <Label>Usuario <span className="text-error-500">*</span></Label>
                  <Input
                    placeholder="Ingresa tu usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}/>
                </div>

                {/* contraseña */}
                

                <div>
                  <Label>
                    Contraseña <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                  <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingresa tu contraseña"
                      value={contrasena}
                      onChange={(e) => setContrasena(e.target.value)}/>
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Mantenerme conectado
                    </span>
                  </div>
                </div>

                {/* Mostrar error si existe */}
                
                {error && <p className="text-sm text-center text-error-500">{error}</p>}

                {/* Botón de inicio de sesión */}
                <div>
                  <Button type="submit" className="w-full" size="sm">
                    Iniciar Sesion
                  </Button>
                </div>
               
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                No tienes una cuenta? {""}
                <Link
                  to="/TailAdmin/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Registrate
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
