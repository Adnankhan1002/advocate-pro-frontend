import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getApiClient } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { setToken, setStoredUser } from '@/lib/auth';

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  tenantName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setUser, setTenant, setToken: setAuthToken } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginPayload) => {
      const api = getApiClient();
      const response = await api.post('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.data?.token) {
        setToken(data.data.token);
        setAuthToken(data.data.token);
      }
      if (data.data?.user) {
        setStoredUser(data.data.user);
        setUser(data.data.user);
      }
      if (data.data?.tenant) {
        setTenant(data.data.tenant);
      }
      queryClient.invalidateQueries();
    },
  });
};

export const useSignup = () => {
  const queryClient = useQueryClient();
  const { setUser, setTenant, setToken: setAuthToken } = useAuthStore();

  return useMutation({
    mutationFn: async (payload: SignupPayload) => {
      const api = getApiClient();
      const response = await api.post('/auth/signup', payload);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.data?.token) {
        setToken(data.data.token);
        setAuthToken(data.data.token);
      }
      if (data.data?.user) {
        setStoredUser(data.data.user);
        setUser(data.data.user);
      }
      if (data.data?.tenant) {
        setTenant(data.data.tenant);
      }
      queryClient.invalidateQueries();
    },
  });
};

export const useCurrentUser = (enabled = true) => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const api = getApiClient();
      const response = await api.get('/auth/me');
      return response.data.data;
    },
    retry: 1,
    enabled,
  });
};
