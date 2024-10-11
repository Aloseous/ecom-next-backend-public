"use client"
import { useParams, useRouter } from "next/navigation"
import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"


import { Separator } from '../ui/separator'
import UploadImage from "../customUI/UploadImage"
import toast from "react-hot-toast"
import Delete from "../customUI/Delete"

interface CollectionFormProps {
    initialData?: CollectionTypes | null
}


const formSchema = z.object({
    title: z.string().min(2).max(20),
    description: z.string().min(2).max(500).trim().optional(),
    image: z.string(),
})


const CollectionsForm: React.FC<CollectionFormProps> = ({ initialData }) => {


    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const params = useParams()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? initialData : {
            title: "",
            description: "",
            image: ""
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            const apiURL = initialData ? `/api/collections/${params.collectionId}` : '/api/collections'
            const method = params.collectionId ? "PUT" : "POST";
            const res = await fetch(apiURL, {
                method: method,
                body: JSON.stringify(values)
            })
            const data = await res.json();
            if (res.ok) {
                toast.success(`Collection ${params.collectionId ? "updated" : "created"}`)
                router.push("/collections");
            } else {
                toast.error(`${data.message} Please Sign in`)
            }

        } catch (error) {
            console.error(["Collection Form"], error)
            toast.error("Collection creation failed 2, Try Again ")
        } finally {
            setLoading(false);
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if ((e.key).toLowerCase() === ("enter").toLowerCase()) {
            e.preventDefault();
        }
    }


    return (
        <div className="p-10">
            {initialData ?
                <div className='flex items-center justify-between'>
                    <p className='text-heading2-bold'>Edit Collection</p>
                    <Delete item="collections" id={initialData._id} />
                </div>
                : <p className='text-heading2-bold'>Create Collection</p>

            }
            <Separator className='bg-grey-1 mt-4 mb-7' />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title<span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input id="title" placeholder="Enter title" {...field} onKeyDown={handleKeyPress} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea id="description" placeholder="Write product description" {...field} rows={5} onKeyDown={handleKeyPress} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image<span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <UploadImage value={field.value ? [field.value] : []}
                                        onChange={(url) => field.onChange(url)}
                                        onRemove={() => field.onChange("")} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex gap-10">
                        <Button type="submit" className="bg-blue-1 text-white" disabled={loading} >Submit</Button>
                        <Button type="button" className="bg-red-1 text-white" onClick={() => router.push('/collections')}>Discard</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default CollectionsForm