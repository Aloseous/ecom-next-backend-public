import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/connectToDB";
import Product from "@/lib/models/Products";
import Collection from "@/lib/models/Collection";
import mongoose from "mongoose";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders })
}

export const GET = async (request: NextRequest, { params }: { params: { productId: string } }) => {
    // const userId = auth();
    try {
        await connectToDB();

        const product = await Product.findById(params.productId).populate({ path: "collections", model: Collection })
        if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 })
        return NextResponse.json(product,
            {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": `${process.env.ECOM_STORE_URL}`,
                    "Access-Control-Allow-Methods": "GET",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
            })
    } catch (error) {
        console.error("Product ID GET", error);
        return NextResponse.json({ message: "Product not found" }, { status: 500 })

    }
}

export const PUT = async (req: NextRequest, { params }: { params: { productId: string } }) => {


    try {
        const { userId } = auth();
        if (!userId) return NextResponse.json({ message: "Unauthorized user" }, { status: 401 });

        await connectToDB();

        const product = await Product.findById(params.productId);
        if (!product) return NextResponse.json({ message: "Product not found" }, { status: 404 });

        const { title, description, media, category, collections, tags, colors, sizes, price, expense } = await req.json();

        if (!title || !description || !media || !category || !price || !expense) {
            return new NextResponse("Not enough data to create a new product", {
                status: 400,
            });
        }


        const addedCollections = collections.filter((collectionId: string) =>
            !product.collections.some((existingCollection: mongoose.Types.ObjectId) =>
                existingCollection.equals(collectionId)
            )
        );

        // Remove collections that are in the product but not in the input
        const removedCollections = product.collections.filter((existingCollection: mongoose.Types.ObjectId) =>
            !collections.includes(existingCollection.toString())
        );

        // Update collections
        await Promise.all([
            ...addedCollections.map((collectionId: string) =>
                Collection.findByIdAndUpdate(collectionId, {
                    $push: { products: product._id },
                })
            ),
            ...removedCollections.map((collectionId: string) =>
                Collection.findByIdAndUpdate(collectionId, {
                    $pull: { products: product._id },
                })
            ),
        ]);

        const updatedProduct = await Product.findByIdAndUpdate(params.productId, {
            title,
            description,
            media,
            category,
            collections,
            tags,
            colors,
            sizes,
            price,
            expense,
        }, { new: true }).populate({ path: "collections", model: Collection });
        // await updatedProduct.save();

        // if (!updatedProduct) return NextResponse.json({ message: "Product not found" }, { status: 404 });

        return NextResponse.json(updatedProduct, { status: 200 });

    } catch (error) {
        console.error("Product Update Error", error);
        return NextResponse.json({ message: "Error updating product" }, { status: 500 });
    }
};


export const DELETE = async (request: NextRequest, { params }: { params: { productId: string } }) => {
    try {
        const { userId } = auth();
        if (!userId) return new NextResponse("Unathorized user", { status: 401 });

        await connectToDB();
        await Product.findByIdAndDelete(params.productId);

        return new NextResponse("Product is deleted", { status: 200 })

    } catch (error) {
        console.error("Product Delete", error)
        return new NextResponse("Unable to Delete", { status: 500 })
    }

}

export const dynamic = "force-dynamic"