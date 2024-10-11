
"use client"
import { useParams, useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
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
import toast from "react-hot-toast"
import Delete from "../customUI/Delete"
import MultiText from "../customUI/MultiText"
import MultiSelect from "../customUI/MultiSelect"
import UploadImage from "../customUI/UploadImage"
import Loader from "../customUI/Loader"

interface ProductFormProps {
    initialData?: ProductTypes | null
}


const formSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters").max(20, "Title can't exceed 20 characters"),
    description: z.string().min(2).max(500).trim().optional(),
    media: z.array(z.string()),
    category: z.string().min(1, "Category is required"),
    collections: z.array(z.string()).min(1, "Collection is required"),
    tags: z.array(z.string()).min(1, "Tags are required"),
    colors: z.array(z.string()).min(1, "Colors are required"),
    sizes: z.array(z.string()).min(1, "Sizes are required"),
    price: z.coerce.number().min(1, "Price must be greater than 0"),
    expense: z.coerce.number().min(0.1, "Expense must be greater than 0"),
});


const ProductsForm: React.FC<ProductFormProps> = ({ initialData }) => {


    const [loading, setLoading] = useState(true);
    const [collections, setCollections] = useState<CollectionTypes[]>([])
    const router = useRouter();

    const params = useParams()

    const getCollections = async () => {

        try {
            // setLoading(true)
            const res = await fetch("/api/collections", {
                method: "GET"
            })
            const data = await res.json();
            setCollections(data);
        } catch (error) {
            console.error("From prod Collection get", error)
        } finally {
            setLoading(false)
        }
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
            ? {
                ...initialData,
                collections: initialData.collections.map(
                    (collection) => collection._id
                ),
            } : {
                title: "",
                description: "",
                media: [],
                category: "",
                collections: [],
                tags: [],
                colors: [],
                sizes: [],
                price: 1,
                expense: 0.1,

            },
    })


    const onSubmit = async (values: z.infer<typeof formSchema>) => {

        try {
            setLoading(true);
            const apiURL = initialData ? `/api/products/${params.productId}` : '/api/products'
            const method = params.productId ? "PUT" : "POST";
            const res = await fetch(apiURL, {
                method: method,
                body: JSON.stringify(values),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(`Product ${params.productId ? "updated" : "created"}`);
                router.push("/products");
            } else {
                toast.error(`${data.message} Please Sign in`)
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Product submission failed. Try again.");
        } finally {
            setLoading(false);
        }
    }

    const handleKeyPress = (
        e:
            | React.KeyboardEvent<HTMLInputElement>
            | React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
        if ((e.key).toLowerCase() === "enter") {
            e.preventDefault();
        }
    };

    useEffect(() => {
        getCollections()
    }, [])

    return (
        <>{loading ? <Loader /> : (<div className="p-10">
            {initialData ?
                <div className='flex items-center justify-between'>
                    <p className='text-heading2-bold'>Edit Product</p>
                    <Delete item="products" id={initialData._id} />
                </div>
                : <p className='text-heading2-bold'>Create Product</p>

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
                        name="media"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image<span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <UploadImage value={field.value}
                                        onChange={(url) => {
                                            const currentImages = form.getValues("media");
                                            field.onChange([...currentImages, url])
                                        }}
                                        onRemove={(url) => field.onChange([...field.value.filter(imageURL => imageURL !== url)])}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="md:grid md:grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input type="number" id="price" placeholder="Enter price" {...field} onKeyDown={handleKeyPress} />
                                    </FormControl>
                                    <FormMessage className="text-red-1" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="expense"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Expense<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input type="number" id="expense" placeholder="Enter expense" {...field} onKeyDown={handleKeyPress} />
                                    </FormControl>
                                    <FormMessage className="text-red-1" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input id="Category" placeholder="Enter category" {...field} onKeyDown={handleKeyPress} />
                                    </FormControl>
                                    <FormMessage className="text-red-1" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <MultiText placeholder="tags..." value={field.value} onChange={(tag) => field.onChange([...field.value, tag])}
                                            onRemove={(tagToRemove) => field.onChange([...field.value.filter(tag => tag !== tagToRemove)])}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-1" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="collections"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Collection<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <MultiSelect collections={collections} placeholder="collections" value={field.value} onChange={(_id) => field.onChange([...field.value, _id])}
                                            onRemove={(idToRemove) => field.onChange([...field.value.filter(collectionId => collectionId !== idToRemove)])}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-1" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="colors"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Colors<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <MultiText placeholder="colors..." value={field.value} onChange={(colors) => field.onChange([...field.value, colors])}
                                            onRemove={(colorsToRemove) => field.onChange([...field.value.filter(colors => colors !== colorsToRemove)])}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-1" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sizes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sizes<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <MultiText placeholder="sizes..." value={field.value} onChange={(sizes) => field.onChange([...field.value, sizes])}
                                            onRemove={(sizesToRemove) => field.onChange([...field.value.filter(sizes => sizes !== sizesToRemove)])}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-1" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex gap-10">
                        <Button type="submit" className="bg-blue-1 text-white" disabled={loading} >Submit</Button>
                        <Button type="button" className="bg-red-1 text-white" onClick={() => router.push('/products')}>Discard</Button>
                    </div>
                </form>
            </Form>
        </div>)} </>
    )
}

export default ProductsForm