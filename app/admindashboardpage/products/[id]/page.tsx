"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { IProduct } from "@/app/services/IProduct";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"admin" | "viewer">("viewer");
  const [product, setProduct] = useState<IProduct>();

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.replace("/signin");

      const { data: userRow } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single();
      setRole((userRow?.role as "admin" | "viewer") ?? "viewer");

      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      setProduct(data);
      setLoading(false);
    })();
  }, [id, router]);

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <span className="animate-pulse text-lg font-medium text-gray-400">
          Loading product…
        </span>
      </div>
    );

  if (!product)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="rounded-xl bg-gray-800 p-10 shadow-lg">
          <h1 className="text-2xl font-bold text-red-400">
            Product not found
          </h1>
          <p className="mt-3 text-gray-300">
            The product you’re looking for doesn’t exist.
          </p>
          <Link
            href="/admindashboardpage/products"
            className="mt-6 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            ← Back to list
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 py-12 text-gray-100">
      <div className="mx-auto max-w-3xl px-4">
        <div className="overflow-hidden rounded-3xl border border-gray-700 bg-gray-800 shadow-xl">
          <div className="flex items-center justify-between gap-4 bg-gray-800 px-8 py-6">
            <div className="flex items-center gap-3">
              <Link
                href="/admindashboardpage/products"
                className="rounded-md bg-gray-700 px-3 py-1 text-sm text-gray-200 transition hover:bg-gray-600"
              >
                ← List
              </Link>
              {role === "admin" && (
                <Link
                  href={`/admindashboardpage/products/${product.id}/edit`}
                  className="rounded-md bg-yellow-600/20 px-3 py-1 text-sm text-yellow-400 transition hover:bg-yellow-600/30"
                >
                  ✏️ Edit
                </Link>
              )}
            </div>

            {product.price != null && (
              <span className="inline-flex items-center rounded-full bg-indigo-600/20 px-4 py-1 text-lg font-semibold text-indigo-300">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <div className="px-8 pb-10 pt-6">
            <h1 className="text-3xl font-bold">{product.name}</h1>

            <section className="mt-8">
              <h2 className="text-lg font-semibold text-gray-300">Description</h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-gray-200">
                {product.description || "No description available."}
              </p>
            </section>

            <section className="mt-10 rounded-lg bg-gray-700/40 p-6">
              <h3 className="text-sm font-medium text-gray-400">Product ID</h3>
              <p className="text-gray-200">{product.id}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
