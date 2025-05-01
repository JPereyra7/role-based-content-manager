import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { format } from "date-fns/format";
import { IProduct } from "@/app/services/IProduct";

export function getColumns(role: "admin" | "viewer"): ColumnDef<IProduct>[] {
  return [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "description", header: "Description" },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) =>
        row.original.price != null ? `$${row.original.price}` : "-",
    },
    {
      accessorKey: "updated_at",
      header: "Last Modified",
      cell: ({ row }) =>
        format(new Date(row.original.updated_at), "yyyy-MM-dd HH:mm"),
    },
    {
      id: "actions",
      header: () => null,
      cell: ({ row }) => {
        const p = row.original;
        return role === "admin" ? (
          <>
            <Link
              href={`/admindashboardpage/products/${p.id}`}
              className="text-shadow-slate-800 hover:underline"
            >
              View
            </Link>

            <Link
              href={`/admindashboardpage/products/${p.id}/edit`}
              className="text-shadow-slate-800 ml-2 hover:underline"
            >
              Edit
            </Link>
          </>
        ) : (
          <Link
            href={`/admindashboardpage/products/${p.id}`}
            className="text-indigo-400 underline"
          >
            View
          </Link>
        );
      },
    },
  ];
}
