"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
	const [userName, setUserName] = useState("");
	const [error, setError] = useState("");
	const { login } = useAuth();
	const router = useRouter();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!userName.trim()) {
			setError("Please enter your name.");
			return;
		}
		login(userName.trim());
		router.push("/");
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
			<form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
				<h2 className="text-2xl font-bold mb-6 text-indigo-700">Login</h2>
				<input
					type="text"
					placeholder="Enter your name"
					value={userName}
					onChange={e => setUserName(e.target.value)}
					className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
				/>
				{error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
				<button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition">Login</button>
				<div className="mt-4 text-center text-sm">
					Don't have an account? <a href="/signup" className="text-indigo-600 hover:underline">Sign up</a>
				</div>
			</form>
		</div>
	);
}
