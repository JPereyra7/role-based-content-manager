"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { DataTable } from "@/components/ui/DataTable";
import { getUserColumns, DbUser } from "./columns";

export default function UsersPage() {
  const router = useRouter();

  const [role,  setRole]  = useState<"admin" | "viewer" | null>(null);
  const [users, setUsers] = useState<DbUser[]>([]);
  const [selfId, setSelf] = useState<string>("");

  const [loading, setLoad] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/signin"); return; }

      setSelf(session.user.id);

      const { data: meRow } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single();
      const myRole = (meRow?.role as "admin" | "viewer") ?? "viewer";
      setRole(myRole);

      const { data } = await supabase
        .from("users")
        .select("id,email,role")
        .order("email");

      setUsers((data ?? []) as DbUser[]);
      setLoad(false);
    })();
  }, [router]);

  if (loading) return <p className="p-8">Loading…</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Users</h2>

      <DataTable
        data={users}
        columns={getUserColumns(role!, selfId, setUsers)}
      />
    </div>
  );
}
