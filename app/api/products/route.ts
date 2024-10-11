import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/connectToDB";
import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Products";

export const POST = async (req: NextRequest) => {
    try {

        const { userId } = auth();
        if (!userId) return NextResponse.json({ message: "Unauthorized user" }, { status: 403 })
        await connectToDB();

        const { title, description, media, category, collections, tags, colors, sizes, price, expense } = await req.json();


        const existingProduct = await Product.findOne({ title });

        if (existingProduct && existingProduct !== null) return NextResponse.json({ message: "Product  alread exist 1" }, { status: 400 })

        const newProduct = await Product.create({
            title, description, media, category, collections, tags, colors, sizes, price, expense,
        })

        if (collections) {
            for (const collectionId of collections) {
                const collection = await Collection.findById(collectionId);
                if (collection) {
                    collection.products.push(newProduct._id);
                    await collection.save();
                }
            }
        }


        await newProduct.save();
        return NextResponse.json(newProduct, { status: 200 });
    } catch (error) {
        console.error("[product_post]", error);
        return new NextResponse("Product post failed", { status: 500 })
    }
}

export const GET = async () => {

    try {
        await connectToDB();
        const products = await Product.find().sort({ createdAt: "desc" }).populate({ path: "collections", model: Collection })
        return NextResponse.json(products, { status: 200 })
    } catch (error) {
        console.error("[product`_GET]", error);
        return new NextResponse("Product Get failed", { status: 500 })

    }

}

export const dynamic = "force-dynamic"