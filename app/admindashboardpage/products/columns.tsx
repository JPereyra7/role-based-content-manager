import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
}

export function getColumns(role: "admin" | "viewer"): ColumnDef<Product>[] {
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
      id: "actions",
      header: () => null,
      cell: ({ row }) => {
        const p = row.original;
        return role === "admin" ? (
          <>
            <Link
              href={`/admindashboardpage/products/${p.id}`}
              className="text-indigo-400 underline"
            >
              View
            </Link>

            <Link
              href={`/admindashboardpage/products/${p.id}/edit`}
              className="text-yellow-400 underline ml-2"
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
