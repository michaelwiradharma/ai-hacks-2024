// frontend/app/types/database.tsx
export interface Post {
  id: number;
  title: string;
  author: string;
  role?: string;
  time: string;
  content: string;
  link?: string;
  replies?: Reply[];
}

export interface Reply {
  id: number;
  author: string;
  role?: string;
  time: string;
  content: string;
  parentReplyId: number | null;
  replies?: Reply[];
}

export interface DiscussionProps {
  post: Post;
}
