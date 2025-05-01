"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import charpstarLogo from "@/public/charpstarlogo.svg";
import { supabase } from "@/lib/supabase";

export const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"admin" | "viewer">("viewer");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const {
      data: { user },
      error: signUpError,
    } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } }, // store chosen role in user_metadata
    });

    if (signUpError || !user) {
      setError(signUpError?.message ?? "Unknown error during sign-up");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase
      .from("users")
      .insert([{ id: user.id, role }]);

    setLoading(false);
    if (insertError) {
      setError("Failed to save role: " + insertError.message);
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="max-w-md p-8 bg-gray-800 rounded-2xl shadow-lg text-center space-y-4">
          <Image
            src={charpstarLogo}
            alt="Logo"
            width={120}
            height={40}
            className="mx-auto"
          />
          <h2 className="text-green-400 text-xl font-semibold">
            Account Created!
          </h2>
          <p className="text-gray-300">
            A confirmation email has been sent to <strong>{email}</strong>, or
            click the button below to sign in:
          </p>
          <Link
            href="/signin"
            className="inline-block px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full p-8 bg-gray-800 rounded-2xl shadow-lg space-y-6">
        <div className="flex justify-center">
          <Image src={charpstarLogo} alt="Logo" width={120} height={40} />
        </div>

        {error && <p className="text-red-400 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block mb-1 text-gray-100">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-gray-100">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 text-gray-100">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Role dropdown */}
          <div>
            <label className="block mb-1 text-gray-100">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "admin" | "viewer")}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-50 focus:ring-2 focus:ring-indigo-400"
            >
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already a member?{" "}
          <Link href="/signin" className="text-indigo-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
