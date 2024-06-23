// frontend/app/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Discussion from "./components/discussion";
import { getPosts } from "./api/api";
import { Post } from "./types/database";
import { timeAgo } from "./utils/timeAgo";
import HeatMap from "./components/heatmap";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currId, setCurrId] = useState<number>(1);
  const [currPost, setCurrPost] = useState<Post>();

  useEffect(() => {
    const fetchData = async () => {
      let data = await getPosts();
      setPosts([
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

  useEffect(() => {
    const filtered = posts.filter((p: Post) => p.id == currId)[0];
    setCurrPost(filtered);
  }, [posts, currId]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-darkgray">
      <div className="flex w-full max-w-7xl h-screen bg-gray rounded shadow-lg">
        {/* sidebar */}
        <div className="w-1/4 p-6 border-r border-gray-700">
          <div className="flex flex-col gap-4">
            {posts.map((post: Post) => (
              <div
                onClick={() => {
                  setCurrId(post.id);
                  console.log(post.id);
                }}
                key={post.id}
                className="p-2 border-b border-gray-700 cursor-pointer hover:bg-[#444444] hover:rounded-md"
              >
                <h3 className="font-bold text-blue-600">{post.title}</h3>
                <p className="text-sm text-gray-400">
                  {post.author} • {timeAgo.format(new Date(post.time))}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* main */}
        <div className="w-3/4 p-6 bg-[#2e2e2e] max-h-screen overflow-auto">
          {currPost && posts.length > 0 && <Discussion post={currPost} />}
        </div>
      </div>
    </main>
  );
}
