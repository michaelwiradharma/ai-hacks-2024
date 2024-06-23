"use client";

import React, { useEffect, useState } from "react";
import Discussion from "./components/discussion";
import { getPosts } from "./api/posts";

// TODO: HARD-CODE
const posts = [
  {
    id: 0,
    title: "[Final] Summer 2022",
    author: "Marie",
    role: "STAFF",
    time: "5 days ago",
    content: `You can find the past exams here.\n
              When posting questions, please reference the exam type and question number in bold at the beginning in this format: Exam Type–Question Number\n
              For example: MT1–7d, or Final–3aiii`,
    replies: [
      {
        id: 0,
        author: "Peyrin",
        time: "1 month ago",
        content: "yadayadayada",
        parentReplyId: null,
        replies: [
          {
            id: 1,
            author: "Anonymous Ant",
            time: "1 month ago",
            content: "komenkomenkomen",
            parentReplyId: 0,
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: 1,
    title: "[SU24] Private Tutor",
    author: "Carol",
    role: "FACULTY/STAFF",
    time: "1 week ago",
    content: "Looking for a private tutor for summer sessions.",
    replies: [],
  },
  {
    id: 2,
    title: "[FA24] ASE (UCS/TA, UGSI) Application Deadline",
    author: "Eddie",
    role: "FACULTY/STAFF",
    time: "2 months ago",
    content:
      "Reminder: The application deadline for Fall 2024 ASE positions is approaching. Submit your applications soon!",
    replies: [],
  },
];

export default function Home() {
  const [currId, setCurrId] = useState<number>(0);

  useEffect(() => {
    const getData = async () => {
      const data = await getPosts();
      console.log(data?.data);
    }
    getData();
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-gray-800">
      <div className="flex w-full max-w-7xl min-h-screen bg-gray-900 rounded shadow-lg">
        {/* sidebar */}
        <div className="w-1/4 p-6 border-r border-gray-700">
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <div
                onClick={() => setCurrId(post.id)}
                key={post.id}
                className="p-2 border-b border-gray-700 cursor-pointer hover:bg-[#666666] hover:rounded-md "
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
          <Discussion post={posts[currId]} />
        </div>
      </div>
    </main>
  );
}