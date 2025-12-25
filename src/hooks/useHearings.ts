import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiClient } from '@/lib/api';
import { toast } from 'sonner';

export const useHearings = (page = 1, limit = 10, status = '') => {
  return useQuery({
    queryKey: ['hearings', page, limit, status],
    queryFn: async () => {
      const api = getApiClient();
      const response = await api.get('/hearings/upcoming/list', {
        params: { page, limit, ...(status && { status }) },
      });
      return response.data;
    },
  });
};

export const useUpcomingHearings = (days = 7) => {
  return useQuery({
    queryKey: ['upcomingHearings', days],
    queryFn: async () => {
      const api = getApiClient();
      const response = await api.get('/hearings/upcoming/list', {
        params: { days, limit: 100 },
      });
      return response.data.data;
    },
  });
};

export const useHearingCalendar = (month: number, year: number) => {
  return useQuery({
    queryKey: ['hearingCalendar', month, year],
    queryFn: async () => {
      const api = getApiClient();
      const response = await api.get('/hearings/calendar', {
        params: { month, year },
      });
      return response.data.data;
    },
  });
};

export const useHearingById = (hearingId: string) => {
  return useQuery({
    queryKey: ['hearing', hearingId],
    queryFn: async () => {
      const api = getApiClient();
      const response = await api.get(`/hearings/${hearingId}`);
      return response.data.data;
    },
    enabled: !!hearingId,
  });
};

export const useCreateHearing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const api = getApiClient();
      const response = await api.post('/hearings', payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hearings'] });
      queryClient.invalidateQueries({ queryKey: ['upcomingHearings'] });
      queryClient.invalidateQueries({ queryKey: ['hearingCalendar'] });
      toast.success('Hearing scheduled successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to schedule hearing');
    },
  });
};

export const useUpdateHearing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ hearingId, ...payload }: any) => {
      const api = getApiClient();
      const response = await api.put(`/hearings/${hearingId}`, payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hearings'] });
      queryClient.invalidateQueries({ queryKey: ['upcomingHearings'] });
      queryClient.invalidateQueries({ queryKey: ['hearingCalendar'] });
      toast.success('Hearing updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update hearing');
    },
  });
};

export const useDeleteHearing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (hearingId: string) => {
      const api = getApiClient();
      await api.delete(`/hearings/${hearingId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hearings'] });
      queryClient.invalidateQueries({ queryKey: ['upcomingHearings'] });
      queryClient.invalidateQueries({ queryKey: ['hearingCalendar'] });
      toast.success('Hearing deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete hearing');
    },
  });
};
