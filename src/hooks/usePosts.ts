import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useHttpRequestService } from '../service/HttpRequestService';
import { useToast } from '../context/ToastContext';
import type { Post, PostData } from '../service';

export const useGetPosts = (limit?: number) => {
  const service = useHttpRequestService();
  
  return useQuery({
    queryKey: ['posts', { limit }],
    queryFn: () => service.getPosts(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetFollowingPosts = (limit?: number, before?: string, after?: string) => {
  const service = useHttpRequestService();
  
  return useQuery({
    queryKey: ['posts', 'following', { limit, before, after }],
    queryFn: () => service.getFollowingPosts(limit, before, after),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useGetPostById = (postId: string) => {
  const service = useHttpRequestService();
  
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => service.getPostById(postId),
    enabled: !!postId,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

export const useGetCommentsByPostId = (postId: string) => {
  const service = useHttpRequestService();
  
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => service.getCommentsByPostId(postId),
    enabled: !!postId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useGetPostsFromProfile = (userId: string) => {
  const service = useHttpRequestService();
  
  return useQuery({
    queryKey: ['posts', 'profile', userId],
    queryFn: () => service.getPostsFromProfile(userId),
    enabled: !!userId,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

export const useGetPostImages = (postId: string) => {
  const service = useHttpRequestService();
  
  return useQuery({
    queryKey: ['postImages', postId],
    queryFn: () => service.getPostImages(postId),
    enabled: !!postId,
    staleTime: 10 * 60 * 1000, // 10 minutes - images rarely change
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const service = useHttpRequestService();
  const { showError } = useToast();
  
  return useMutation({
    mutationFn: async (data: PostData & { images?: File[] }) => {
      // Create the post first
      const postData: PostData = {
        content: data.content,
        parentId: data.parentId,
      };
      
      const createdPost = await service.createPost(postData);
      
      // If there are images, handle the image upload process
      if (data.images && data.images.length > 0) {
        for (let i = 0; i < data.images.length; i++) {
          const image = data.images[i];
          const fileExt = image.name.split('.').pop();
          
          // Get the S3 upload URL
          const uploadUrlResponse = await service.getImageUploadUrl(createdPost.id, fileExt!, i);
          
          // Upload to S3
          await service.uploadImageToS3(uploadUrlResponse.uploadUrl, image);
          
          // Link the image to the post
          await service.linkImageToPost(createdPost.id, uploadUrlResponse.key, i);
        }
      }
      
      return createdPost;
    },
    onSuccess: (newPost, variables) => {
      // If it's a comment, invalidate related queries
      if (variables.parentId) {
        queryClient.invalidateQueries({ queryKey: ['comments', variables.parentId] });
        queryClient.invalidateQueries({ queryKey: ['post', variables.parentId] });
      }
      
      // For all posts, invalidate the infinite queries to trigger a fresh fetch
      // This is safer than optimistic updates and prevents undefined post issues
      queryClient.invalidateQueries({ queryKey: ['posts', 'infinite'] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'following', 'infinite'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error('Failed to create post:', error);
      showError('Hubo un error al crear el tweet. Por favor, inténtalo de nuevo.');
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const service = useHttpRequestService();
  
  return useMutation({
    mutationFn: (postId: string) => service.deletePost(postId),
    onSuccess: (_, deletedPostId) => {
      // Remove from regular post caches
      queryClient.setQueryData(['posts'], (oldData: Post[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter(post => post.id !== deletedPostId);
      });
      
      queryClient.setQueryData(['posts', 'following'], (oldData: Post[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter(post => post.id !== deletedPostId);
      });
      
      // Remove from infinite query caches
      queryClient.setQueryData(['posts', 'infinite'], (oldData: any) => {
        if (!oldData) return oldData;
        
        const newPages = oldData.pages.map((page: Post[]) => 
          page.filter(post => post.id !== deletedPostId)
        );
        
        return {
          ...oldData,
          pages: newPages,
        };
      });
      
      queryClient.setQueryData(['posts', 'following', 'infinite'], (oldData: any) => {
        if (!oldData) return oldData;
        
        const newPages = oldData.pages.map((page: Post[]) => 
          page.filter(post => post.id !== deletedPostId)
        );
        
        return {
          ...oldData,
          pages: newPages,
        };
      });
      
      // Invalidate all post-related queries
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', deletedPostId] });
    },
    onError: (error) => {
      console.error('Failed to delete post:', error);
    },
  });
};

export const useCreateReaction = () => {
  const queryClient = useQueryClient();
  const service = useHttpRequestService();
  const { showError } = useToast();
  
  return useMutation({
    mutationFn: ({ postId, reaction }: { postId: string; reaction: string }) =>
      service.createReaction(postId, reaction),
    onSuccess: (_, { postId }) => {
      // Invalidate all queries that might contain this post (including infinite queries)
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
    onError: (error) => {
      console.error('Failed to create reaction:', error);
      showError('Sucedió un error al agregar la reacción. Por favor, inténtalo de nuevo.');
    },
  });
};

export const useDeleteReaction = () => {
  const queryClient = useQueryClient();
  const service = useHttpRequestService();
  const { showError } = useToast();
  
  return useMutation({
    mutationFn: ({ postId, reactionType }: { postId: string; reactionType: string }) => 
      service.deleteReactionByPost(postId, reactionType),
    onSuccess: (_, { postId }) => {
      // Invalidate all queries that might contain this post (including infinite queries)
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
    onError: (error) => {
      console.error('Failed to delete reaction:', error);
      showError('Sucedió un error al eliminar la reacción. Por favor, inténtalo de nuevo.');
    },
  });
};

export const useGetInfinitePosts = () => {
  const service = useHttpRequestService();
  
  return useInfiniteQuery({
    queryKey: ['posts', 'infinite'],
    queryFn: ({ pageParam = undefined }) => service.getPaginatedPosts(10, undefined, pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage, allPages) => {
      // If the last page has fewer than 10 posts, we've reached the end
      if (!lastPage || lastPage.length < 10) {
        return undefined;
      }
      // Use the ID of the last post in the current page as the 'after' parameter for the next page
      return lastPage[lastPage.length - 1].id;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetInfiniteFollowingPosts = () => {
  const service = useHttpRequestService();
  
  return useInfiniteQuery({
    queryKey: ['posts', 'following', 'infinite'],
    queryFn: ({ pageParam = undefined }) => service.getPaginatedFollowingPosts(10, undefined, pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage, allPages) => {
      // If the last page has fewer than 10 posts, we've reached the end
      if (!lastPage || lastPage.length < 10) {
        return undefined;
      }
      // Use the ID of the last post in the current page as the 'after' parameter for the next page
      return lastPage[lastPage.length - 1].id;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};