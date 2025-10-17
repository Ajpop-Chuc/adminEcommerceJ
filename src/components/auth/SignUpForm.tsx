import { useState, useEffect, FormEvent } from "react";
//import { Link, useNavigate } from "react-router";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import { apiService } from "../../service/api"; //Importe de servicio
import { API_CONFIG } from "../../config/api"; // Importa la configuración de la API

// Interfaz para el tipo de dato de Rol
interface Rol {
  id_rol: number;
  nombre: string;
}

export default function SignUpForm() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rolId, setRolId] = useState('');
  const [roles, setRoles] = useState<Rol[]>([]);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        console.log('🔄 Iniciando fetchRoles...');
        console.log('📍 URL base:', API_CONFIG.baseURL); // Verifica que la URL sea correcta
        
        const fetchedRoles = await apiService.get<Rol[]>('/auth/roles');
        
        console.log('✅ Roles recibidos:', fetchedRoles);
        console.log('📊 Cantidad:', fetchedRoles.length);
        
        setRoles(fetchedRoles);
      } catch (err: any) {
        console.error("❌ Error completo:", err);
        console.error("❌ Status:", err.status);
        console.error("❌ Data:", err.data);
        setError('No se pudieron cargar los roles.');
      }
    };
    fetchRoles();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!usuario || !contrasena || !rolId) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    try {
      await apiService.post('/auth/register', {
        usuario,
        contrasena,
        rol_id_rol: parseInt(rolId, 10),
      });
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
      navigate('/TailAdmin/signin');
    } catch (err: any) {
      setError(err.data?.message || "Error en el registro.");
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Resgistrate
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Llena la informacion para registrarte!
            </p>
          </div>
          <div>
            {/* <!-- Form --> */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
              <div>
                <div>
                  {/* <!-- Usuario --> */}
                  <div className="sm:col-span-1">
                    <Label>Usuario<span className="text-error-500">*</span></Label>
                    <Input value={usuario} onChange={(e) => setUsuario(e.target.value)} placeholder="Ingresa tu nombre de usuario"/>
                  </div>
                </div>

                <div>
                  {/* <!-- Contraseña --> */}
                  <div>
                    <Label>
                      Contraseña<span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                    <Input placeholder="Ingresa tu contraseña"type={showPassword ? "text" : "password"}onChange={(e) => setContrasena(e.target.value)}/>
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
                  </div>

                  <div>
                {/* rol */}
                <div>
                  <Label>Rol<span className="text-error-500">*</span></Label>
                  <select value={rolId} onChange={(e) => setRolId(e.target.value)}required className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
                    <option value="">Selecciona un rol</option>
                    {roles.map((rol) => (
                      <option key={rol.id_rol} value={rol.id_rol}>
                        {rol.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                </div>

                {error && <p className="text-sm text-center text-error-500">{error}</p>}

                {/* <!-- Button --> */}
                <div>
                  <button type="submit" className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                    Registrarme
                  </button>
                </div>

                
              </div>

              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Ya tienes una cuenta?
                <Link
                  to="/TailAdmin/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Iniciar Sesion
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
