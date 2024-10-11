import { connectToDB } from "@/lib/connectToDB";
import Product from "@/lib/models/Products";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { productId: string } }) => {
    try {
        await connectToDB();
        const product = await Product.findById(params.productId);
        if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });

        const relatedProducts = await Product.find({
            $or: [
                { category: product.category },
                { collections: { $in: product.collections } }
            ],
            _id: { $ne: product._id }
        })
        if (!relatedProducts) return NextResponse.json({ message: "No Related Products found." }, { status: 404 });
        return NextResponse.json(relatedProducts, { status: 200 });
    } catch (error) {
        console.error("[product`_GET]", error);
    }
};

export const dynamic = "force-dynamic"