export interface SingUpData {
  name: string;
  password: string;
  email: string;
  username: string;
}

export interface SingInData {
  username?: string;
  email?: string;
  password: string;
}

export interface PostData {
  content: string;
  parentId?: string;
  images?: File[];
}

export interface Post {
  id: string;
  content: string;
  parentId?: string;
  images?: string[];
  createdAt: Date;
  authorId: string;
  author: Author;
  // Legacy fields (keeping for backward compatibility)
  reactions?: Reaction[];
  comments?: Post[];
  // New fields from backend API
  qtyLikes: number;
  qtyRetweets: number;
  qtyComments: number;
  hasLiked: boolean;
  hasRetweeted: boolean;
}

export interface Reaction {
  id: string;
  type: string;
  createdAt: Date;
  userId: string;
  postId: string;
  updatedAt: Date;
  deletedAt?: Date;
}
export interface Author {
  id: string;
  name?: string;
  username: string;
  profilePicture?: string;
  private: boolean;
  createdAt: Date;
}

export interface User {
  id: string;
  name?: string;
  username: string;
  profilePicture?: string;
  private: boolean;
  createdAt: Date;
  followers: Author[];
  following: Author[];
  posts: Post[];
  isFollowed?: boolean;
}

export interface MessageDTO {
  id: string;
  content: string;
  createdAt: Date;
  chatId: string;
  senderId: string;
  sender: Author;
}

export interface ChatDTO {
  id: string;
  users: Author[];
  messages: MessageDTO[];
}

export interface PostImage {
  id: string;
  postId: string;
  s3Key: string;
  index: number;
  createdAt: Date;
  url: string;
}
