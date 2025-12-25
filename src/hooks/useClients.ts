import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiClient } from '@/lib/api';
import { toast } from 'sonner';

interface ClientPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  dateOfBirth?: string;
  aadharNumber?: string;
  panNumber?: string;
  category: 'individual' | 'corporate' | 'organization';
  notes?: string;
}

export const useClients = (page = 1, limit = 10, status = 'active', search = '') => {
  return useQuery({
    queryKey: ['clients', page, limit, status, search],
    queryFn: async () => {
      const api = getApiClient();
      const response = await api.get('/clients', {
        params: { page, limit, status, search },
      });
      return response.data;
    },
  });
};

export const useClientById = (clientId: string) => {
  return useQuery({
    queryKey: ['client', clientId],
    queryFn: async () => {
      const api = getApiClient();
      const response = await api.get(`/clients/${clientId}`);
      return response.data.data;
    },
    enabled: !!clientId,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ClientPayload) => {
      const api = getApiClient();
      const response = await api.post('/clients', payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ clientId, ...payload }: ClientPayload & { clientId: string }) => {
      const api = getApiClient();
      const response = await api.put(`/clients/${clientId}`, payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (clientId: string) => {
      console.log('Attempting to delete client:', clientId);
      const api = getApiClient();
      const response = await api.delete(`/clients/${clientId}`);
      console.log('Delete response:', response.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['clientStats'] });
      toast.success('Client deleted successfully');
    },
    onError: (error: any) => {
      console.error('Delete client error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const errorMessage = error.response?.data?.message || 'Failed to delete client';
      toast.error(errorMessage);
    },
  });
};

export const useClientStats = () => {
  return useQuery({
    queryKey: ['clientStats'],
    queryFn: async () => {
      const api = getApiClient();
      const response = await api.get('/clients/stats/overview');
      return response.data.data;
    },
  });
};
