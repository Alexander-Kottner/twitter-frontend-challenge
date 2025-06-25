import { useQueryClient } from '@tanstack/react-query';
import { useGetCurrentUser } from './useUsers';
import { performLogout } from '../service/HttpRequestService';

export const useAuth = () => {
  const queryClient = useQueryClient();
  
  // Check if user has a token in localStorage
  const hasToken = () => {
    const token = localStorage.getItem("token");
    return token && token.trim() !== "" && token !== "null";
  };

  const login = (token: string) => {
    localStorage.setItem("token", token);
    queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
  };

  const logout = () => {
    performLogout();
    // Clear all cached data
    queryClient.clear();
  };

  return {
    hasToken,
    login,
    logout,
    isAuthenticated: hasToken()
  };
};

export const useCurrentUser = () => {
  const { hasToken } = useAuth();
  
  // Use React Query to fetch current user
  const {
    data: currentUser,
    isLoading: userLoading,
    error,
  } = useGetCurrentUser();

  return { 
    currentUser, 
    userLoading: userLoading && hasToken(),
    error 
  };
};