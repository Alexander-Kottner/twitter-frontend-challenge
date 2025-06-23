import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useHttpRequestService } from '../service/HttpRequestService';
import type { ChatDTO } from '../service';

export const useGetChats = () => {
  const service = useHttpRequestService();
  
  return useQuery({
    queryKey: ['chats'],
    queryFn: () => service.getChats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useGetChat = (chatId: string) => {
  const service = useHttpRequestService();
  
  return useQuery({
    queryKey: ['chat', chatId],
    queryFn: () => service.getChat(chatId),
    enabled: !!chatId,
    staleTime: 30 * 1000, // 30 seconds - chats update frequently
  });
};

export const useCreateChat = () => {
  const queryClient = useQueryClient();
  const service = useHttpRequestService();
  
  return useMutation({
    mutationFn: (userId: string) => service.createChat(userId),
    onSuccess: () => {
      // Invalidate chats list to show new chat
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
    onError: (error) => {
      console.error('Failed to create chat:', error);
    },
  });
};

export const useGetMutualFollows = () => {
  const service = useHttpRequestService();
  
  return useQuery({
    queryKey: ['users', 'mutualFollows'],
    queryFn: () => service.getMutualFollows(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};