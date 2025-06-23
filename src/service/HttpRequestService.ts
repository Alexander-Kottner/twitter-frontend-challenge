import type { PostData, SingInData, SingUpData } from "./index";
import axios from "axios";
import { S3Service } from "./S3Service";

const url =
  process.env.REACT_APP_API_URL || "https://twitter-ieea.onrender.com/api";

// Global query client reference for logout functionality
let globalQueryClient: any = null;

export const setGlobalQueryClient = (queryClient: any) => {
  globalQueryClient = queryClient;
};

export const performLogout = () => {
  // Clear authentication token
  localStorage.removeItem("token");
  
  // Clear React Query cache if available
  if (globalQueryClient) {
    globalQueryClient.clear();
  }
};

const apiClient = axios.create({
  baseURL: url,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

apiClient.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    performLogout();
    window.location.href = "/sign-in"; // Redirect to sign-in page
  }
  return Promise.reject(error);
})

const httpRequestService = {
  signUp: async (data: Partial<SingUpData>) => {
    const res = await apiClient.post("/auth/signup", data);
    if (res.status === 201) {
      localStorage.setItem("token", `Bearer ${res.data.token}`);
      return true;
    }
  },
  signIn: async (data: SingInData) => {
    const res = await apiClient.post("/auth/login", data);
    if (res.status === 200) {
      localStorage.setItem("token", `Bearer ${res.data.token}`);
      return true;
    }
  },
  createPost: async (data: PostData) => {
    const res = await apiClient.post("/post", data);
    if (res.status === 201) {
      const { upload } = S3Service;
      for (const imageUrl of res.data.images) {
        const index: number = res.data.images.indexOf(imageUrl);
        await upload(data.images![index], imageUrl);
      }
      return res.data;
    }
  },
  getPaginatedPosts: async (limit?: number, before?: string, after?: string) => {
    const params: any = {};
    if (limit) params.limit = limit;
    if (before) params.before = before;
    if (after) params.after = after;

    const res = await apiClient.get("/post", {
      params,
    });
    if (res.status === 200) {
      return res.data;
    }
  },
  getPosts: async (limit?: number) => {
    const params: any = {};
    if (limit) params.limit = limit;

    const res = await apiClient.get("/post", {
      params,
    });
    if (res.status === 200) {
      return res.data;
    }
  },
  getFollowingPosts: async (limit?: number, before?: string, after?: string) => {
    const params: any = {};
    if (limit) params.limit = limit;
    if (before) params.before = before;
    if (after) params.after = after;

    const res = await apiClient.get("/post/following", {
      params,
    });
    if (res.status === 200) {
      return res.data;
    }
  },
  getPaginatedFollowingPosts: async (limit?: number, before?: string, after?: string) => {
    const params: any = {};
    if (limit) params.limit = limit;
    if (before) params.before = before;
    if (after) params.after = after;

    const res = await apiClient.get("/post/following", {
      params,
    });
    if (res.status === 200) {
      return res.data;
    }
  },
  getRecommendedUsers: async (limit: number, skip: number) => {
    const res = await apiClient.get("/user", {
      params: {
        limit,
        skip,
      },
    });
    if (res.status === 200) {
      return res.data;
    }
  },
  me: async () => {
    const res = await apiClient.get("/user/me");
    if (res.status === 200) {
      return res.data;
    }
  },
  getPostById: async (id: string) => {
    const res = await apiClient.get(`/post/${id}`);
    if (res.status === 200) {
      return res.data;
    }
  },
  createReaction: async (postId: string, reaction: string) => {
    const res = await apiClient.post(
      `/reaction/${postId}`,
      { type: reaction }
    );
    if (res.status === 201) {
      return res.data;
    }
  },
    deleteReaction: async (reactionId: string) => {
    const res = await apiClient.delete(`/reaction/${reactionId}`);
    if (res.status === 200) {
      return res.data;
    }
  },
  deleteReactionByPost: async (postId: string, reactionType: string) => {
    // This should match your backend endpoint: DELETE /reaction/:post_id with body { type }
    const res = await apiClient.delete(`/reaction/${postId}`, {
      data: { type: reactionType }
    });
    if (res.status === 200) {
      return res.data;
    }
  },
  followUser: async (userId: string) => {
    const res = await apiClient.post(
      `/follower/follow/${userId}`,
      {}
    );
    if (res.status === 201) {
      return res.data;
    }
  },
  unfollowUser: async (userId: string) => {
    const res = await apiClient.post(
      `/follower/unfollow/${userId}`,
      {}
    );
    if (res.status === 200) {
      return res.data;
    }
  },
  searchUsers: async (username: string, limit: number, skip: number) => {
    try {
      const cancelToken = axios.CancelToken.source();

      const response = await apiClient.get("/user/search", {
        params: {
          username,
          limit,
          skip,
        },
        cancelToken: cancelToken.token,
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      if (!axios.isCancel(error)) console.log(error);
    }
  },

  getProfile: async (id: string) => {
    const res = await apiClient.get(`/user/profile/${id}`);
    if (res.status === 200) {
      return res.data;
    }
  },
  getPaginatedPostsFromProfile: async (
    limit: number,
    after: string,
    id: string
  ) => {
    const res = await apiClient.get(`/post/by_user/${id}`, {
      params: {
        limit,
        after,
      },
    });

    if (res.status === 200) {
      return res.data;
    }
  },
  getPostsFromProfile: async (id: string) => {
    const res = await apiClient.get(`/post/by_user/${id}`);

    if (res.status === 200) {
      return res.data;
    }
  },

  isLogged: async () => {
    const res = await apiClient.get("/user/me");
    return res.status === 200;
  },

  getProfileView: async (id: string) => {
    const res = await apiClient.get(`/user/${id}`);

    if (res.status === 200) {
      return res.data;
    }
  },

  deleteProfile: async () => {
    const res = await apiClient.delete("/user/me");

    if (res.status === 204) {
      performLogout();
    }
  },

  getChats: async () => {
    const res = await apiClient.get("/chat");

    if (res.status === 200) {
      return res.data;
    }
  },

  getMutualFollows: async () => {
    const res = await apiClient.get("/follow/mutual");

    if (res.status === 200) {
      return res.data;
    }
  },

  createChat: async (id: string) => {
    const res = await apiClient.post(
      "/chat",
      {
        users: [id],
      }
    );

    if (res.status === 201) {
      return res.data;
    }
  },

  getChat: async (id: string) => {
    const res = await apiClient.get(`/chat/${id}`);

    if (res.status === 200) {
      return res.data;
    }
  },

  deletePost: async (id: string) => {
    await apiClient.delete(`/post/${id}`);
  },

  getPaginatedCommentsByPostId: async (
    id: string,
    limit: number,
    after: string
  ) => {
    const res = await apiClient.get(`/comment/${id}`, {
      params: {
        limit,
        after,
      },
    });
    if (res.status === 200) {
      return res.data;
    }
  },
  getCommentsByPostId: async (id: string) => {
    const res = await apiClient.get(`/comment/${id}`);
    if (res.status === 200) {
      return res.data;
    }
  },

  getImageUploadUrl: async (postId: string, fileExt: string, index: number) => {
    const res = await apiClient.get(`/post/${postId}/image-upload-url`, {
      params: {
        fileExt,
        index,
      },
    });
    if (res.status === 200) {
      return res.data;
    }
  },

  uploadImageToS3: async (uploadUrl: string, file: File) => {
    await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
      },
    });
  },  

  linkImageToPost: async (postId: string, s3Key: string, index: number) => {
    const res = await apiClient.post(
      `/post/${postId}/image`,
      {
        s3Key,
        index,
      }
    );
    if (res.status === 201) {
      return res.data;
    }
  },

  getPostImages: async (postId: string) => {
    const res = await apiClient.get(`/post/${postId}/images`);
    if (res.status === 200) {
      return res.data;
    }
  },
};

const useHttpRequestService = () => httpRequestService;

// For class component (remove when unused)
class HttpService {
  service = httpRequestService;
}

export { useHttpRequestService, HttpService };
