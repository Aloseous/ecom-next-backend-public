"use client"

import { ColumnDef } from "@tanstack/react-table"
import Delete from "../customUI/Delete"
import Link from "next/link"

export const columns: ColumnDef<ProductTypes>[] = [
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) =>
            <Link key={row.original._id} href={`/products/${row.original._id}`} className="hover:text-red-1">
                <p>{row.original.title}
                </p>
            </Link>
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => <p>{row.original.category}</p>
    },
    {
        accessorKey: "collection",
        header: "Collection",
        cell: ({ row }) => row.original.collections.map(collection => collection.title).join(', ')
    },
    {
        accessorKey: "price",
        header: "Price",
    },
    {
        accessorKey: "expense",
        header: "Expense",
    },
    {
        id: "actions",
        cell: ({ row }) => <Delete item="products" id={row.original._id} />
    }
]