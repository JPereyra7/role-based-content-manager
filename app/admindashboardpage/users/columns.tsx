import { ColumnDef } from "@tanstack/react-table";
import { supabase } from "@/lib/supabase";

export interface DbUser {
  id: string;
  email: string;
  role: "admin" | "viewer";
}

export function getUserColumns(
  role: "admin" | "viewer",
  selfId: string,
  setUsers: React.Dispatch<React.SetStateAction<DbUser[]>>
): ColumnDef<DbUser>[] {
  return [
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role",  header: "Role"  },
    {
      id: "actions",
      header: () => null,
      cell: ({ row }) => {
        const u = row.original;
        if (role !== "admin" || u.id === selfId) return null;
        const next = u.role === "admin" ? "viewer" : "admin";

        return (
          <button
            className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-indigo-500 cursor-pointer"
            onClick={async () => {
              const { error } = await supabase
                .from("users")
                .update({ role: next })
                .eq("id", u.id);

              if (!error) {
                setUsers((prev) =>
                  prev.map((usr) =>
                    usr.id === u.id ? { ...usr, role: next } : usr
                  )
                );
              } else {
                alert(error.message);
              }
            }}
          >
            Set&nbsp;{next}
          </button>
        );
      },
    },
  ];
}
