"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/customUI/DataTable";
import { columns } from "@/components/orders/OrderColumn";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/customUI/Loader";

const Orders = () => {

    const [loading, setLoading] = useState(true)
    const [orders, setOrders] = useState([])


    const getCollections = async () => {

        try {
            const res = await fetch("/api/orders", {
                method: "GET"
            })
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error("Collection get", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getCollections();
    }, [])

    return loading ? <Loader /> : (
        <div className="px-10 py-5">
            <p className="text-heading2-bold">Orders</p>
            <Separator className="bg-grey-1 my-5" />
            <DataTable columns={columns} data={orders} searchKey="_id" />
        </div>
    )
}

export const dynamic = "force-dynamic"
export default Orders;
