"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IProduct } from "@/app/services/IProduct";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [, setRole] = useState<"admin" | "viewer" | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.replace("/signin");

      const { data: userRow } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single();

      const myRole = (userRow?.role as "admin" | "viewer") ?? "viewer";
      setRole(myRole);
      if (myRole !== "admin") return router.replace("/admindashboardpage/products");

      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (!data) return router.replace("/admindashboardpage/products");

      setProduct(data as IProduct);
      setLoading(false);
    })();
  }, [id, router]);

  const handleSave = async () => {
    if (!product) return;
    setSaving(true);
    const { error } = await supabase
      .from("products")
      .update({
        name: product.name,
        description: product.description,
        price: product.price,
      })
      .eq("id", product.id);
    setSaving(false);
    if (error) setError(error.message);
    else router.replace("/admindashboardpage/products");
  };

  const handleDelete = async () => {
    if (!product) return;
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", product.id);
    router.replace("/admindashboardpage/products");
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <span className="animate-pulse text-gray-400">Loading…</span>
      </div>
    );
  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-900 py-12 text-gray-100">
      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="space-y-8 rounded-3xl border border-gray-700 bg-gray-800 p-8 shadow-xl">
          <h2 className="text-3xl font-bold">Edit product</h2>
          {error && <p className="text-red-400">{error}</p>}

          <div className="space-y-6">
            <label className="block space-y-2">
              <span className="text-sm text-gray-300">Name</span>
              <Input
                className="bg-gray-700 text-gray-100"
                value={product.name}
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value })
                }
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-gray-300">Description</span>
              <textarea
                className="w-full rounded-md bg-gray-700 p-3 text-gray-100"
                rows={4}
                value={product.description ?? ""}
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-gray-300">Price</span>
              <Input
                type="number"
                step="0.01"
                className="bg-gray-700 text-gray-100"
                value={product.price ?? ""}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    price:
                      e.target.value === "" ? null : Number(e.target.value),
                  })
                }
              />
            </label>
          </div>

          {/* actions */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-indigo-600 text-white hover:bg-indigo-500"
            >
              {saving ? "Saving…" : "Save"}
            </Button>

            <Button
              onClick={handleDelete}
              disabled={saving}
              className="bg-red-600 text-white hover:bg-red-500"
            >
              Delete
            </Button>

            <Button
              variant="ghost"
              onClick={() => router.back()}
              disabled={saving}
              className="bg-gray-700 text-gray-100 hover:bg-gray-600"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
