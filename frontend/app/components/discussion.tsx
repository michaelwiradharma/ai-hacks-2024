// frontend/app/components/discussion.tsx
import React, { useCallback, useEffect, useState } from "react";
import { DiscussionProps, Reply } from "../types/database";
import { getReplies, addReply } from "../api/posts";
import { timeAgo } from "../utils/timeAgo";

export default function Discussion({ post }: DiscussionProps) {
  const [replyContent, setReplyContent] = useState<string>("");
  const [allReplies, setAllReplies] = useState<Reply[]>([]);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [nestedReplyContent, setNestedReplyContent] = useState<string>("");

  const [triggerFetch, setTriggerFetch] = useState<boolean>(false);

  const mapReplies = (replies: any) => {
    return replies.map((reply: any) => ({
      id: reply.id,
      author: reply.username,
      role: reply.user_type,
      time: reply.created_at,
      content: reply.content,
      parentReplyId: reply.parent_reply_id,
      replies: reply.replies ? mapReplies(reply.replies) : [], // Recursively map nested replies
    }));
  };

  useEffect(() => {
    const fetchReplies = async () => {
      const data = await getReplies(post.id);
      if (data) {
        setAllReplies(mapReplies(data));
      }
    };
    fetchReplies();
    setTriggerFetch(false);
  }, [post, triggerFetch]);

  const handleReplySubmit = async () => {
    const newReply = await addReply(post.id, replyContent);
    if (newReply) {
      setTriggerFetch(true);
      setReplyContent("");
    }
  };

  const handleNestedReplySubmit = async (parentId: number) => {
    const newReply = await addReply(post.id, nestedReplyContent, parentId);
    if (newReply) {
      setTriggerFetch(true);
      setNestedReplyContent("");
      setReplyingTo(null);
    }
  };

  const renderReplies = (replies: Reply[], level: number = 0) => {
    return replies.map((reply, id) => (
      <div
        key={reply.id}
        className={`ml-${level * 4} mt-4 pl-4 border-l border-gray-700`}
      >
        <p className="text-gray-500">
          {reply.author} • {timeAgo.format(new Date(reply.time))}
        </p>
        <p className="whitespace-pre-line text-gray-300">{reply.content}</p>
        <button
          className="text-blue-500 text-sm"
          onClick={() => setReplyingTo(reply.id)}
        >
          Reply
        </button>
        {reply.replies &&
          reply.replies.length > 0 &&
          renderReplies(reply.replies, level + 1)}
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
          {post.author} • {timeAgo.format(new Date(post.time))}
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
