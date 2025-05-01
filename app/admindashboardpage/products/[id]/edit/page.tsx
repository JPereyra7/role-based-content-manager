"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
}

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [, setRole] = useState<"admin" | "viewer" | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const myRole = (userRow?.role as "admin" | "viewer") ?? "viewer";
      setRole(myRole);
      if (myRole !== "admin") {
        router.replace("/admindashboardpage/products");
        return;
      }
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      if (!data) {
        router.replace("/admindashboardpage/products");
        return;
      }
      setProduct(data as Product);
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
    if (!window.confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", product.id);
    router.replace("/admindashboardpage/products");
  };

  if (loading) return <p className="p-8">Loading…</p>;
  if (!product) return null;

  return (
    <div className="p-8 max-w-xl space-y-6">
      <h2 className="text-2xl font-bold">Edit product</h2>
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">
        <label className="block space-y-1">
          <span>Name</span>
          <Input
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
          />
        </label>

        <label className="block space-y-1">
          <span>Description</span>
          <textarea
            className="w-full rounded-md bg-gray-100 p-2"
            rows={4}
            value={product.description ?? ""}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
          />
        </label>

        <label className="block space-y-1">
          <span>Price</span>
          <Input
            type="number"
            step="0.01"
            value={product.price ?? ""}
            onChange={(e) =>
              setProduct({
                ...product,
                price: e.target.value === "" ? null : Number(e.target.value),
              })
            }
          />
        </label>
      </div>

      <div className="flex gap-4 pt-4">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
        <Button variant="destructive" onClick={handleDelete} disabled={saving}>
          Delete
        </Button>
        <Button variant="secondary" onClick={() => router.back()} disabled={saving}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
