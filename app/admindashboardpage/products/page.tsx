"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { DataTable } from "@/components/ui/DataTable";
import { getColumns, Product } from "./columns";

export default function ProductsPage() {
  const [role, setRole] = useState<"admin" | "viewer" | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      const myRole = (userRole?.role as "admin" | "viewer") ?? "viewer";
      setRole(myRole);

      const { data } = await supabase.from("products").select("*");
      setProducts(data as Product[]);
      setLoading(false);
    })();
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
