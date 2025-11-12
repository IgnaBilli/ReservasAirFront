import { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from './useLogin';
import { Button } from '@/components/ui/Button';

const LoginPage = () => {
  const navigate = useNavigate();
  const { 
    email, 
    setEmail, 
    password, 
    setPassword, 
    error, 
    isLoading, 
    handleLogin 
  } = useLogin();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const success = await handleLogin();
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ✈️ ReservasAir
          </h1>
          <p className="text-gray-600">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="pepito@gmail.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              disabled={isLoading}
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            loading={isLoading}
            className="w-full py-3 text-lg"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Credenciales de prueba:</p>
          <p className="font-mono text-xs mt-1">pepito@gmail.com / 12345678</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
