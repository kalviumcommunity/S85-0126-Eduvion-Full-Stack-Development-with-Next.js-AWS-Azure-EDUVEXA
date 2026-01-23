import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6">Welcome to Eduvexa 🎓</h1>
      <p className="text-lg text-gray-600 mb-8 text-center">
        Your gateway to modern learning and development
      </p>
      <div className="flex gap-4">
        <Link 
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Login
        </Link>
        <Link 
          href="/dashboard"
          className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Dashboard
        </Link>
      </div>
    </main>
  );
}
