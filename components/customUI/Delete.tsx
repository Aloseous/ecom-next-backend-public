"use client"

import { useState } from 'react'
import { Trash } from 'lucide-react'
import { Button } from '../ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import toast from 'react-hot-toast'
import Loader from './Loader'

interface DeleteProps {
    item?: string,
    id: string,
}


const Delete: React.FC<DeleteProps> = ({ item, id }) => {


    const [loading, setLoading] = useState(false);


    const onDelete = async () => {

        try {
            setLoading(true);
            const res = await fetch(`/api/${item}/${id}`, {
                method: "DELETE",
            })
            if (!res.ok) throw new Error('Failed to delete');
            window.location.href = (`/${item}`)
            toast.success(`${item} deleted.`)
        } catch (error) {
            console.error("onDelete -->", error);
            toast.error(`Unable to delete ${item}`)
        } finally {
            setLoading(false);
        }
    }
    return loading ? <Loader /> : (

        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="bg-red-1 text-white">
                    <Trash className='h-4 w-4' />
                </Button></AlertDialogTrigger>
            <AlertDialogContent className='bg-white text-grey-1'>
                <AlertDialogHeader>
                    <AlertDialogTitle className='text-red-1'>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your ${item}.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='sm:justify-center'>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className='bg-red-1 text-white' onClick={onDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}

export default Delete