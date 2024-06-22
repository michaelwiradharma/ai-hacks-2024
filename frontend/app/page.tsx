import Image from "next/image";
import React from "react";
import Discussion from "./discussion";

// TODO: HARD-CODE 
const posts = [
  {
    id: 1,
    title: 'CS & EECS Drop-in Advising Only Available Thurs PM this Week!',
    author: 'Lydia Raya',
    role: 'FACULTY/STAFF',
    time: '5 days ago',
    content: `Due to the Juneteenth Holiday, virtual drop-in advising for CS & EECS students will only be available Thursday, 6/20, 1:30-3:30PM this week. Back to regular summer hours next week!`,
    link: 'https://berkeley.zoom.us/j/98554504308',
  },
  {
    id: 2,
    title: '[SU24] Private Tutor',
    author: 'Carol',
    role: 'FACULTY/STAFF',
    time: '1 week ago',
    content: 'Looking for a private tutor for summer sessions.',
  },
  {
    id: 3,
    title: '[FA24] ASE (UCS/TA, UGSI) Application Deadline',
    author: 'Faculty',
    role: 'FACULTY/STAFF',
    time: '2 months ago',
    content: 'Reminder: The application deadline for Fall 2024 ASE positions is approaching. Submit your applications soon!',
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-gray-100">
      <div className="flex w-full max-w-6xl bg-white rounded shadow">
        {/* sidebar */}
        <div className="w-1/4 p-4 border-r">
          <div className="flex flex-col gap-4">
            {posts.map(post => (
              <div key={post.id} className="p-2 border-b">
                <h3 className="font-bold text-blue-600">{post.title}</h3>
                <p className="text-sm text-gray-500">{post.author} • {post.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* main */}
        <div className="w-3/4 p-4">
          {posts.map(post => (
            <div key={post.id} className="mb-8">
              <h2 className="text-2xl font-bold text-gray-700">{post.title}</h2>
              <p className="text-gray-500">{post.author} • {post.role} • {post.time}</p>
              <p className="mt-4 text-gray-600">{post.content}</p>
              {post.link && (
                <a href={post.link} className="text-blue-500" target="_blank" rel="noopener noreferrer">
                  {post.link}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}