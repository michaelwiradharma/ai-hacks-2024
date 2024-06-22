interface Post {
    post: any;
}

export default function Discussion({ post }: Post) {
  return (
    <div key={post.id} className="mb-8">
      <h2 className="text-2xl font-bold text-white-700">{post.title}</h2>
      <p className="text-white-500">
        {post.author} • {post.role} • {post.time}
      </p>
      <p className="mt-4 text-white-600">{post.content}</p>
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
    </div>
  );
}
