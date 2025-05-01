"use client";

import { useEffect, useState } from "react";
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
      if (!session) return router.replace("/signin");

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
    const { error } = await supabase
      .from("products")
      .insert([{ name, description, price }]);
    setSaving(false);

    if (error) setError(error.message);
    else router.replace("/admindashboardpage/products");
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 text-gray-100">
      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="space-y-8 rounded-3xl border border-gray-700 bg-gray-800 p-8 shadow-xl">
          <h2 className="text-3xl font-bold">Add product</h2>
          {error && <p className="text-red-400">{error}</p>}

          <div className="space-y-6">
            <label className="block space-y-2">
              <span className="text-sm text-gray-300">Name</span>
              <Input
                className="bg-gray-700 text-gray-100"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-gray-300">Description</span>
              <textarea
                rows={4}
                className="w-full rounded-md bg-gray-700 p-3 text-gray-100"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-gray-300">Price</span>
              <Input
                type="number"
                step="0.01"
                className="bg-gray-700 text-gray-100"
                value={price ?? ""}
                onChange={(e) =>
                  setPrice(
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
              />
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleCreate}
              disabled={saving}
              className="bg-indigo-600 text-white hover:bg-indigo-500"
            >
              {saving ? "Saving…" : "Create"}
            </Button>

            <Button
              variant="ghost"
              disabled={saving}
              onClick={() => router.back()}
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
