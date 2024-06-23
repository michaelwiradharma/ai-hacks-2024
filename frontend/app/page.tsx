// frontend/app/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Discussion from "./components/discussion";
import { getPosts } from "./api/posts";
import { Post } from "./types/database";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currId, setCurrId] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      let data = await getPosts();
      setPosts([
        ...posts,
        ...data.map((post: any) => ({
          id: post.id,
          content: post.content,
          time: post.created_at,
          title: post.title,
          author: post.username,
          role: post.user_type,
        })),
      ]);
    };
    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-gray-800">
      <div className="flex w-full max-w-7xl min-h-screen bg-gray-900 rounded shadow-lg">
        {/* sidebar */}
        <div className="w-1/4 p-6 border-r border-gray-700">
          <div className="flex flex-col gap-4">
            {posts.map((post: Post) => (
              <div
                onClick={() => setCurrId(post.id)}
                key={post.id}
                className="p-2 border-b border-gray-700 cursor-pointer hover:bg-[#666666] hover:rounded-md"
              >
                <h3 className="font-bold text-blue-600">{post.title}</h3>
                <p className="text-sm text-gray-400">
                  {post.author} • {post.time}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* main */}
        <div className="w-3/4 p-6 bg-[#2e2e2e]">
          {posts.length > 0 && (
            <Discussion post={posts.filter((p: Post) => p.id == currId)[0]} />
          )}
        </div>
      </div>
    </main>
  );
}
