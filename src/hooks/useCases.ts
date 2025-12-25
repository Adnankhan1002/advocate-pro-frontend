import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiClient } from '@/lib/api';
import { toast } from 'sonner';

interface CasePayload {
  clientId: string;
  caseNumber: string;
  title: string;
  description?: string;
  caseType: string;
  status?: string;
  court?: {
    name: string;
    location: string;
    jurisdiction: string;
  };
  judge?: string;
  oppositeParty?: string;
  oppositeAdvocate?: string;
  filingDate?: string;
  nextHearingDate?: string;
  budget?: number;
  priority?: 'high' | 'medium' | 'low';
  assignedTo?: string;
  tags?: string[];
  notes?: string;
}

export const useCases = (page = 1, limit = 10, status = '', caseType = '', search = '') => {
  return useQuery({
    queryKey: ['cases', page, limit, status, caseType, search],
    queryFn: async () => {
      const api = getApiClient();
      const response = await api.get('/cases', {
        params: {
          page,
          limit,
          ...(status && { status }),
          ...(caseType && { caseType }),
          ...(search && { search }),
        },
      });
      return response.data;
    },
  });
};

export const useCaseById = (caseId: string) => {
  return useQuery({
    queryKey: ['case', caseId],
    queryFn: async () => {
      const api = getApiClient();
      const response = await api.get(`/cases/${caseId}`);
      return response.data.data;
    },
    enabled: !!caseId,
  });
};

export const useCasesByClient = (clientId: string) => {
  return useQuery({
    queryKey: ['cases', 'client', clientId],
    queryFn: async () => {
      const api = getApiClient();
      const response = await api.get('/cases', {
        params: { clientId, limit: 100 },
      });
      return response.data.data;
    },
    enabled: !!clientId,
  });
};

export const useCreateCase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CasePayload) => {
      const api = getApiClient();
      const response = await api.post('/cases', payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      queryClient.invalidateQueries({ queryKey: ['caseStats'] });
      toast.success('Case created successfully');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to create case';
      toast.error(errorMessage);
    },
  });
};

export const useUpdateCase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ caseId, ...payload }: CasePayload & { caseId: string }) => {
      const api = getApiClient();
      const response = await api.put(`/cases/${caseId}`, payload);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      queryClient.invalidateQueries({ queryKey: ['case', variables.caseId] });
      queryClient.invalidateQueries({ queryKey: ['caseStats'] });
      toast.success('Case updated successfully');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update case';
      toast.error(errorMessage);
    },
  });
};

export const useCaseStats = () => {
  return useQuery({
    queryKey: ['caseStats'],
    queryFn: async () => {
      const api = getApiClient();
      const response = await api.get('/cases/stats/overview');
      return response.data.data;
    },
  });
};

export const useDeleteCase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (caseId: string) => {
      const api = getApiClient();
      const response = await api.delete(`/cases/${caseId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      queryClient.invalidateQueries({ queryKey: ['caseStats'] });
      toast.success('Case deleted successfully');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to delete case';
      toast.error(errorMessage);
    },
  });
};
