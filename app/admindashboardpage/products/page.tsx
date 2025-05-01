"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { DataTable } from "@/components/ui/DataTable";
import { getColumns } from "./columns";
import { IProduct } from "@/app/services/IProduct";

export default function ProductsPage() {
  const [role, setRole] = useState<"admin" | "viewer" | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/signin";
        return;
      }

      const { data: userRole } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single();
      setRole((userRole?.role as "admin" | "viewer") ?? "viewer");

      const { data } = await supabase.from("products").select("id,name,description,price,updated_at");
      setProducts(data as IProduct[]);
      setLoading(false);

      channel = supabase
        .channel("products-feed")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "products" },
          ({ eventType, new: newRow, old }) => {
            setProducts((prev) => {
              switch (eventType) {
                case "INSERT":
                  return [...prev, newRow as IProduct];
                case "UPDATE":
                  return prev.map((p) =>
                    p.id === newRow.id ? (newRow as IProduct) : p
                  );
                case "DELETE":
                  return prev.filter((p) => p.id !== old.id);
                default:
                  return prev;
              }
            });
          }
        )
        .subscribe();
    })();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  if (loading) return <p className="p-8">Loading…</p>;

  return (
    <div className="p-6 space-y-4">
      {role === "admin" && (
        <Link
          href="/admindashboardpage/products/new"
          className="inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-400 transition-all duration-200"
        >
          + Add Product
        </Link>
      )}

      <DataTable columns={getColumns(role!)} data={products} />
    </div>
  );
}
