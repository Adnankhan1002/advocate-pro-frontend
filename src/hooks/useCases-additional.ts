import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiClient } from '@/lib/api';

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

export const useDeleteCase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (caseId: string) => {
      const api = getApiClient();
      await api.delete(`/cases/${caseId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
    },
  });
};
