import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiClient } from '@/lib/api';

export const useDailyDiary = (date: string) => {
  return useQuery({
    queryKey: ['dailyDiary', date],
    queryFn: async () => {
      const api = getApiClient();
      const response = await api.get(`/diaries/daily/${date}`);
      return response.data.data;
    },
    enabled: !!date,
  });
};

export const useCreateDailyDiary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const api = getApiClient();
      const response = await api.post('/diaries/daily', payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyDiary'] });
    },
  });
};

export const useCaseNotes = (caseId: string, page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['caseNotes', caseId, page, limit],
    queryFn: async () => {
      const api = getApiClient();
      const response = await api.get(`/diaries/case-notes/${caseId}`, {
        params: { page, limit },
      });
      return response.data;
    },
    enabled: !!caseId,
  });
};

export const useCreateCaseNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const api = getApiClient();
      const response = await api.post('/diaries/case-notes', payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caseNotes'] });
    },
  });
};

export const useFollowUps = (status = '', priority = '', page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['followUps', status, priority, page, limit],
    queryFn: async () => {
      const api = getApiClient();
      const response = await api.get('/diaries/follow-up', {
        params: { status, priority, page, limit },
      });
      return response.data;
    },
  });
};

export const useCreateFollowUp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const api = getApiClient();
      const response = await api.post('/diaries/follow-up', payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followUps'] });
    },
  });
};

export const useTasks = (status = '', page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['tasks', status, page, limit],
    queryFn: async () => {
      const api = getApiClient();
      const response = await api.get('/diaries/tasks', {
        params: { status, page, limit },
      });
      return response.data;
    },
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const api = getApiClient();
      const response = await api.post('/diaries/tasks', payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
