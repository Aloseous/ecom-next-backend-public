"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"

export const columns: ColumnDef<OrderItemType>[] = [
    {
        accessorKey: "product",
        header: "Product",
        cell: ({ row }) =>
            <Link key={row.original.product._id} href={`/products/${row.original.product._id}`} className="hover:text-red-1">
                <p>{row.original.product.title}
                </p>
            </Link>
    },
    {
        accessorKey: "color",
        header: "Color",
    },
    {
        accessorKey: "size",
        header: "Size",
    },
    {
        accessorKey: "quantity",
        header: "Quantity",
    }
]