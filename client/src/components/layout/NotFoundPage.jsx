function NotFoundPage() {
  return (
    <div className="min-w-screen min-h-screen flex items-center justify-center bg-indigo-50 text-gray-800">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-red-400 tracking-widest">404</h1>
        <p className="mt-5 text-2xl font-semibold">Page Not Found</p>
        <p className="mt-2 text-gray-500">Sorry, the page you are looking for does not exist.</p>
        <a
          href="/posts"
          className="mt-5 inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
}

export default NotFoundPage;
