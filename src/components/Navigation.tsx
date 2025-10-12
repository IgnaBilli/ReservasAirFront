import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { Button } from './ui/Button';

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAppStore();

  // Don't show navigation on login page
  if (location.pathname === '/login' || !isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMyReservations = () => {
    navigate('/mis-reservas');
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
            onClick={handleHome}
          >
            <span className="text-2xl">✈️</span>
            <h1 className="text-xl font-bold text-gray-900">ReservasAir</h1>
          </div>

          {/* User info and actions */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="text-sm text-gray-700">
                <span className="font-medium">{user.nombre_completo}</span>
                <span className="text-gray-500 ml-2">({user.email})</span>
              </div>
            )}
            
            {location.pathname !== '/mis-reservas' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleMyReservations}
              >
                📋 Mis Reservas
              </Button>
            )}

            <Button
              variant="danger"
              size="sm"
              onClick={handleLogout}
            >
              🚪 Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
