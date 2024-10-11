"use client"
import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { columns } from '@/components/collections/CollectionColumns'
import { DataTable } from '@/components/customUI/DataTable'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useRouter } from 'next/navigation'
import Loader from '@/components/customUI/Loader'

const Collections = () => {
    const [loading, setLoading] = useState(true)
    const [collections, setCollections] = useState([])

    const router = useRouter();

    const getCollections = async () => {

        try {
            const res = await fetch("/api/collections", {
                method: "GET"
            })
            const data = await res.json();
            setCollections(data);
        } catch (error) {
            console.error("Collection get", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getCollections();
    }, [])

    return (
        <div className='px-10 py-5'>
            <div className='flex items-center justify-between'>
                <p className='text-heading2-bold'>Collections</p>
                <Button className='bg-blue-1 text-white' onClick={() => router.push("/collections/create")}>
                    <Plus className='w-4 h-4 mr-2' />
                    Create Collection
                </Button>
            </div>
            <Separator className='bg-grey-1 my-4' />
            {loading ? <Loader /> : <DataTable columns={columns} data={collections} searchKey="title" />}
        </div>
    )
}

export default Collections