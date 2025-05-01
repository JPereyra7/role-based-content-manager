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
    { accessorKey: "role", header: "Role" },
    {
      id: "actions",
      header: () => null,
      cell: ({ row }) => {
        const u = row.original;
        if (role !== "admin" || u.id === "SELF") return null;
        const next = u.role === "admin" ? "viewer" : "admin";

        return (
          <button
            className="text-indigo-400 underline"
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
            set&nbsp;{next}
          </button>
        );
      },
    },
  ];
}
