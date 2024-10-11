"use client"
import { useEffect, useState } from "react"
import ProductsForm from "@/components/products/ProductForm";
import Loader from "@/components/customUI/Loader";


const ProductDetails = ({ params }: { params: { productId: string } }) => {
    const [loading, setLoading] = useState(true);
    const [productDetails, setProductDetails] = useState<ProductTypes | null>(null);

    const getProductDetails = async () => {
        try {
            const res = await fetch(`/api/products/${params.productId}`, {
                method: "GET"
            });
            const data = await res.json();
            setProductDetails(data);
        } catch (error) {
            console.error("productDetails Page Get -->", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getProductDetails()
    }, [])

    return (
        <div>{loading ? <Loader /> : <ProductsForm initialData={productDetails} />}</div>
    )
}

export default ProductDetails