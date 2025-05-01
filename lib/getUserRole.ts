import { createClient } from "@supabase/supabase-js";

export async function getUserAndRole() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { user: null, role: null };

  const { data } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .single();

  return { user: session.user, role: data?.role ?? null };
}
