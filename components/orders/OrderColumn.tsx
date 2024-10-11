"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"

export const columns: ColumnDef<OrderTypes>[] = [
    {
        accessorKey: "_id",
        header: "Order",
        cell: ({ row }) =>
            <Link key={row.original._id} href={`/orders/${row.original._id}`} className="hover:text-red-1">
                <p>{row.original._id}
                </p>
            </Link>
    },
    {
        accessorKey: "customer",
        header: "Customer",
    },
    {
        accessorKey: "products",
        header: "Products",
    },
    {
        accessorKey: "totalAmount",
        header: "Total Amount",
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
    }
]