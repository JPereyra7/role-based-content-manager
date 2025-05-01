"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Product } from "../columns";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"admin" | "viewer">("viewer");
  const [product, setProduct] = useState<Product>();

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/signin");
        return;
      }

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

  if (loading) return <p className="p-8">Loading…</p>;
  if (!product)  return <p className="p-8">Not found.</p>;

  return (
    <div className="p-8 max-w-xl space-y-6">
      <h2 className="text-3xl font-bold">{product.name}</h2>
      {product.price != null && (
        <h3 className="text-xl text-indigo-400">${product.price}</h3>
      )}
      <p className="text-gray-300 whitespace-pre-line">
        {product.description ?? "No description."}
      </p>

      <div className="flex gap-4 pt-4">
        <Link href="/admindashboardpage/products" className="text-indigo-400 underline">
          ← Back to list
        </Link>
        {role === "admin" && (
          <Link
            href={`/admindashboardpage/products/${product.id}/edit`}
            className="text-yellow-400 underline"
          >
            Edit
          </Link>
        )}
      </div>
    </div>
  );
}
