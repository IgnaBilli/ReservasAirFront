import { renderHook, act } from '@testing-library/react';
import { useLogin } from '@/pages/Login/useLogin';

// Mock de apis para evitar llamadas reales
jest.mock('@/services/api', () => {
  const login = jest.fn();
  const logout = jest.fn();
  const isAuthenticated = jest.fn(() => false);
  const getUser = jest.fn();
  const saveUser = jest.fn();
  const setToken = jest.fn();
  const setUser = jest.fn();
  return {
    __esModule: true,
    authService: { login, logout, isAuthenticated, getUser, saveUser },
    tokenManager: { setToken, setUser }
  };
});

import { authService, tokenManager } from '@/services/api';

describe('useLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('performs successful login: saves token+user and returns true', async () => {
    const mockResponse = {
      success: true,
      message: 'Login exitoso',
      data: {
        user: { id: '1', email: 'pepito@gmail.com', rol: 'admin' },
        token: 'jwt.token.here'
      }
    };
    (authService.login as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.setEmail('pepito@gmail.com');
      result.current.setPassword('12345678');
    });


    let ok = false;
    await act(async () => {
      ok = await result.current.handleLogin();
    });


    expect(authService.login).toHaveBeenCalledWith({
      email: 'pepito@gmail.com',
      password: '12345678'
    });
    expect(tokenManager.setToken).toHaveBeenCalledWith('jwt.token.here');
    expect(tokenManager.setUser).toHaveBeenCalledWith({ id: '1', email: 'pepito@gmail.com', rol: 'admin' });
    expect(ok).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('handles login error and returns false with error message', async () => {
    (authService.login as jest.Mock).mockRejectedValueOnce(new Error('Credenciales inválidas'));

    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.setEmail('test@example.com');
      result.current.setPassword('testing');
    });

    let ok = true;
    await act(async () => {
      ok = await result.current.handleLogin();
    });

    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'testing'
    });
    expect(tokenManager.setToken).not.toHaveBeenCalled();
    expect(tokenManager.setUser).not.toHaveBeenCalled();
    expect(ok).toBe(false);
    expect(result.current.error).toBe('Credenciales inválidas');
    expect(result.current.isLoading).toBe(false);
  });
});
