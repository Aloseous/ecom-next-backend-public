"use client"

import { ColumnDef } from "@tanstack/react-table"
import Delete from "../customUI/Delete"
import Link from "next/link"

export const columns: ColumnDef<CollectionTypes>[] = [
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) =>
            <Link key={row.original._id} href={`/collections/${row.original._id}`} className="hover:text-red-1">
                <p>{row.original.title}
                </p>
            </Link>
    },
    {
        accessorKey: "products",
        header: "Products",
        cell: ({ row }) => <p>{row.original.products.length > 1 && row.original.products.length}</p>
    },
    {
        id: "actions",
        cell: ({ row }) => <Delete item="collections" id={row.original._id} />
    }
]