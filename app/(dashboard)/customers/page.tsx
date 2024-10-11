"use client";

import { useEffect, useState } from "react"
import { DataTable } from "@/components/customUI/DataTable";
import { Separator } from "@/components/ui/separator";
import { columns } from "@/components/customers/CustomerColumns";
import Loader from "@/components/customUI/Loader";

const Customers = () => {

    const [loading, setLoading] = useState(true);
    const [customers, setCustomers] = useState([]);

    const getCustomers = async () => {
        try {
            const res = await fetch("/api/customers", {
                method: "GET"
            })

            const data = await res.json();
            setCustomers(data);
        } catch (error) {
            console.error("[customers_GET]", error);

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getCustomers()
    }, [])
    return (
        <>
            {loading ? <Loader /> :
                <div className="px-10 py-5">
                    <p>Customers</p>
                    <Separator className="bg-grey-1 my-5" />
                    <DataTable columns={columns} data={customers} searchKey="email" />
                </div>
            }
        </>
    )
}

export const dynamic = "force-dynamic"
export default Customers