import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/connectToDB";
import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Products";


export const GET = async (req: NextRequest, { params }: { params: { collectionId: string } }) => {
    // const userId = auth();
    try {
        await connectToDB();

        const collection = await Collection.findById(params.collectionId).populate({ path: "products", model: Product });

        if (!collection) return NextResponse.json({ message: "Collection not found" }, { status: 404 })
        return NextResponse.json(collection, { status: 200 })
    } catch (error) {
        console.error("Collection ID GET", error);
        return NextResponse.json({ message: "Collection not found" }, { status: 500 })

    }

}

export const PUT = async (req: NextRequest, { params }: { params: { collectionId: string } }) => {
    try {
        const { userId } = auth();
        if (!userId) return NextResponse.json({ message: "Unauthorized user" }, { status: 401 });

        await connectToDB();
        const { title, description, image } = await req.json();
        if (!title || !image) return NextResponse.json({ message: "Title and image are required" }, { status: 400 });

        const updatedCollection = await Collection.findByIdAndUpdate(params.collectionId, { title, description, image }, { new: true });
        if (!updatedCollection) return NextResponse.json({ message: "Collection not found" }, { status: 404 });

        return NextResponse.json(updatedCollection, { status: 200 });

    } catch (error) {
        console.error("Collection Update Error", error);
        return NextResponse.json({ message: "Error updating collection" }, { status: 500 });
    }
};


export const DELETE = async (req: NextRequest, { params }: { params: { collectionId: string } }) => {
    try {
        const { userId } = auth();
        if (!userId) return new NextResponse("Unathorized user", { status: 401 });

        await connectToDB();
        await Collection.findByIdAndDelete(params.collectionId);

        await Product.updateMany(
            { collections: params.collectionId },
            { $pull: { collections: params.collectionId } }
        )

        return new NextResponse("Collection is deleted", { status: 200 })

    } catch (error) {
        console.error("Collection Delete", error)
        return new NextResponse("Unable to Delete", { status: 500 })
    }

}

export const dynamic = "force-dynamic";