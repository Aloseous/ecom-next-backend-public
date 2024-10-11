"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"

export const columns: ColumnDef<CustomerTypes>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) =>
            <Link key={row.original._id} href={`/customers/${row.original._id}`} className="hover:text-red-1">
                <p>{row.original.name}
                </p>
            </Link>
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "orders",
        header: "Orders",
    }

]