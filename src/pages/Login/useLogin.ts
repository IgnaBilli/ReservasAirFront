import { useState } from 'react';
import { authService, tokenManager } from '@/services/api';
import { useAppStore } from '@/store/useAppStore';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const setUser = useAppStore((state) => state.setUser);

  const handleLogin = async () => {
    setError(null);
    setIsLoading(true);

    try {
        const response = await authService.login({ email, password });

        if (response && response.success && response.data) {
          // Save token and user data to localStorage
          tokenManager.setToken(response.data.token);
          tokenManager.setUser(response.data.user);

          // Update store with user data (will also persist to localStorage via setUser)
          setUser(response.data.user);
          //Muestra toda la info del usuario
          console.log(response.data.user);
          console.log('User ID:', response.data.user.id);

          // Send user ID to reservations backend
          try {
            await fetch('https://reservasairback-develop.up.railway.app/users', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: response.data.user.id
              })
            });
            console.log('User ID sent to reservations backend');
          } catch (backendErr) {
            console.error('Error sending user ID to backend:', backendErr);
            // No bloqueamos el login si falla esta llamada
          }

          return true;
        }

        // If server returned something unexpected
        const msg = (response && (response as any).message) || 'Error al iniciar sesión';
        setError(msg);
        return false;
    } catch (err) {
        console.error('Login error:', err);
        // Use error.message when available
        const message = err instanceof Error ? err.message : 'Error al conectar con el servidor. Por favor, intenta de nuevo.';
        setError(message);
        return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    handleLogin
  };
};
