import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useHttpRequestService } from '../service/HttpRequestService';
import type { User, Author } from '../service';

export const useGetCurrentUser = () => {
  const service = useHttpRequestService();
  
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => service.me(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
};

export const useGetProfile = (userId: string) => {
  const service = useHttpRequestService();
  
  return useQuery({
    queryKey: ['user', 'profile', userId],
    queryFn: () => service.getProfile(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetProfileView = (userId: string) => {
  const service = useHttpRequestService();
  
  return useQuery({
    queryKey: ['user', 'profileView', userId],
    queryFn: () => service.getProfileView(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetRecommendedUsers = (limit: number, skip: number) => {
  const service = useHttpRequestService();
  
  return useQuery({
    queryKey: ['users', 'recommended', { limit, skip }],
    queryFn: () => service.getRecommendedUsers(limit, skip),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSearchUsers = (username: string, limit: number, skip: number) => {
  const service = useHttpRequestService();
  
  return useQuery({
    queryKey: ['users', 'search', { username, limit, skip }],
    queryFn: () => service.searchUsers(username, limit, skip),
    enabled: username.length > 0,
    staleTime: 30 * 1000, // 30 seconds for search results
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();
  const service = useHttpRequestService();
  
  return useMutation({
    mutationFn: (userId: string) => service.followUser(userId),
    onSuccess: (_, userId) => {
      // Invalidate user-related queries
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['user', 'profileView', userId] });
      queryClient.invalidateQueries({ queryKey: ['users', 'recommended'] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'following'] });
    },
    onError: (error) => {
      console.error('Failed to follow user:', error);
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();
  const service = useHttpRequestService();
  
  return useMutation({
    mutationFn: (userId: string) => service.unfollowUser(userId),
    onSuccess: (_, userId) => {
      // Invalidate user-related queries
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['user', 'profileView', userId] });
      queryClient.invalidateQueries({ queryKey: ['users', 'recommended'] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'following'] });
    },
    onError: (error) => {
      console.error('Failed to unfollow user:', error);
    },
  });
};

export const useDeleteProfile = () => {
  const queryClient = useQueryClient();
  const service = useHttpRequestService();
  
  return useMutation({
    mutationFn: () => service.deleteProfile(),
    onSuccess: () => {
      // Clear all cached data on profile deletion
      queryClient.clear();
    },
    onError: (error) => {
      console.error('Failed to delete profile:', error);
    },
  });
};