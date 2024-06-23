import React, { useEffect, useState } from "react";

interface Post {
  id: number;
  title: string;
  author: string;
  role: string;
  time: string;
  content: string;
  link?: string;
  replies: Reply[];
}

interface Reply {
  id: number;
  author: string;
  role?: string;
  time: string;
  content: string;
  parentReplyId: number | null;
  replies: Reply[];
}

interface DiscussionProps {
  post: Post;
}

export default function Discussion({ post }: DiscussionProps) {
  const [replyContent, setReplyContent] = useState<string>("");
  const [allReplies, setAllReplies] = useState<Reply[]>(post.replies);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [nestedReplyContent, setNestedReplyContent] = useState<string>("");

  useEffect(() => {
    setAllReplies(post.replies);
  }, [post]);

  const handleReplySubmit = () => {
    const newReply: Reply = {
      id: allReplies.length,
      author: "Current User", // TODO: Replace with actual current user
      time: "Just now",
      content: replyContent,
      parentReplyId: null,
      replies: [],
    };

    setAllReplies([...allReplies, newReply]);
    setReplyContent("");
  };

  const handleNestedReplySubmit = (parentId: number) => {
    const newReply: Reply = {
      id: allReplies.length,
      author: "Current User", // TODO: Replace with actual current user
      time: "Just now",
      content: nestedReplyContent,
      parentReplyId: parentId,
      replies: [],
    };

    const updatedReplies = allReplies.map(reply => {
      if (reply.id === parentId) {
        return { ...reply, replies: [...reply.replies, newReply] };
      }
      return reply;
    });

    setAllReplies(updatedReplies);
    setNestedReplyContent("");
    setReplyingTo(null);
  };

  const renderReplies = (replies: Reply[], level: number = 0) => {
    return replies.map((reply) => (
      <div key={reply.id} className={`ml-${level * 4} mt-4 pl-4 border-l border-gray-700`}>
        <p className="text-gray-500">
          {reply.author} {reply.role && `• ${reply.role}`} • {reply.time}
        </p>
        <p className="text-gray-300">{reply.content}</p>
        <button
          className="text-blue-500 text-sm"
          onClick={() => setReplyingTo(reply.id)}
        >
          Reply
        </button>
        {reply.replies.length > 0 && renderReplies(reply.replies, level + 1)}
        {replyingTo === reply.id && (
          <div className="mt-4">
            <textarea
              value={nestedReplyContent}
              onChange={(e) => setNestedReplyContent(e.target.value)}
              className="w-full p-2 border rounded bg-gray-800 text-black"
              placeholder="Add a reply..."
            ></textarea>
            <div className="flex justify-end mt-2">
              <button
                onClick={() => handleNestedReplySubmit(reply.id)}
                className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Post
              </button>
            </div>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div key={post.id} className="mb-8">
      <h2 className="text-2xl font-bold text-gray-100">{post.title}</h2>
      <div className="mt-2 mb-6">
        <p className="text-gray-500">
          {post.author} • {post.role} • {post.time}
        </p>
      </div>
      <p className="text-gray-300 whitespace-pre-line">{post.content}</p>
      {post.link && (
        <a
          href={post.link}
          className="text-blue-500"
          target="_blank"
          rel="noopener noreferrer"
        >
          {post.link}
        </a>
      )}
      <hr className="my-6 border-gray-700" />
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-100">Replies</h3>
        {renderReplies(allReplies)}
        <div className="mt-4">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="w-full p-2 border rounded bg-gray-800 text-black"
            placeholder="Add a reply..."
          ></textarea>
          <div className="flex justify-end mt-2">
            <button
              onClick={handleReplySubmit}
              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}