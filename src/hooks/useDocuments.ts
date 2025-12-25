import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiClient } from '@/lib/api';

export const useCaseDocuments = () => {
  return useQuery({
    queryKey: ['case-documents'],
    queryFn: async () => {
      const api = getApiClient();
      const response = await api.get('/documents/by-case');
      return response.data;
    },
  });
};

export const useDocuments = (page = 1, limit = 10, caseId = '', type = '', search = '') => {
  return useQuery({
    queryKey: ['documents', page, limit, caseId, type, search],
    queryFn: async () => {
      const api = getApiClient();
      const response = await api.get('/documents', {
        params: {
          page,
          limit,
          ...(caseId && { caseId }),
          ...(type && { type }),
          ...(search && { search }),
        },
      });
      return response.data;
    },
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, caseId, title, documentType, notes }: { 
      file: File; 
      caseId: string; 
      title?: string; 
      documentType?: string;
      notes?: string;
    }) => {
      const api = getApiClient();
      const formData = new FormData();
      formData.append('document', file);
      formData.append('caseId', caseId);
      if (title) formData.append('title', title);
      if (documentType) formData.append('documentType', documentType);
      if (notes) formData.append('notes', notes);
      
      const response = await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['case-documents'] });
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (documentId: string) => {
      const api = getApiClient();
      await api.delete(`/documents/${documentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['case-documents'] });
    },
  });
};