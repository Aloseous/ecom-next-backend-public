"use client";

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/customUI/DataTable';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import Loader from '@/components/customUI/Loader';
import { columns } from '@/components/products/ProductColumns';

const Products = () => {

    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState<ProductTypes[]>([])

    const getProducts = async () => {

        try {
            const res = await fetch(`/api/products`, {
                method: "GET",
                cache: 'no-store'
            })

            const data = await res.json()
            setProducts(data)
        } catch (error) {
            console.error("GET PRODUCT PAGE -->", error)
        } finally {
            setLoading(false)
        }

    }

    useEffect(() => {
        getProducts()
    }, [])
    return (
        <>
            {loading ? <Loader /> : (<div className='px-10 py-5'>
                <div className='flex items-center justify-between'>
                    <p className='text-heading2-bold'>Products</p>
                    <Button className='bg-blue-1 text-white' onClick={() => router.push("/products/create")}>
                        <Plus className='w-4 h-4 mr-2' />
                        Create Product
                    </Button>
                </div>
                <Separator className='bg-grey-1 my-4' />
                <DataTable columns={columns} data={products} searchKey="title" />
            </div>)}
        </>
    )
}

export default Products