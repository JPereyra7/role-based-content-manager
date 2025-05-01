"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewProductPage() {
  const router = useRouter();
  const [, setRole] = useState<"admin" | "viewer">("viewer");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/signin");
        return;
      }
      const { data } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single();
      const r = (data?.role as "admin" | "viewer") ?? "viewer";
      setRole(r);
      if (r !== "admin") router.replace("/admindashboardpage/products");
    })();
  }, [router]);

  const handleCreate = async () => {
    setSaving(true);
    const { error } = await supabase.from("products").insert([
      { name, description, price },
    ]);
    setSaving(false);
    if (error) setError(error.message);
    else router.replace("/admindashboardpage/products");
  };

  return (
    <div className="p-8 max-w-xl space-y-6">
      <h2 className="text-2xl font-bold">Add product</h2>
      {error && <p className="text-red-500">{error}</p>}

      <label className="block space-y-1">
        <span>Name</span>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </label>

      <label className="block space-y-1">
        <span>Description</span>
        <textarea
          className="w-full rounded-md bg-gray-100 p-2"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <label className="block space-y-1">
        <span>Price</span>
        <Input
          type="number"
          step="0.01"
          value={price ?? ""}
          onChange={(e) =>
            setPrice(e.target.value === "" ? null : Number(e.target.value))
          }
        />
      </label>

      <Button onClick={handleCreate} disabled={saving}>
        {saving ? "Saving…" : "Create"}
      </Button>
    </div>
  );
}
