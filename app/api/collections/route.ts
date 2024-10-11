import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/connectToDB";
import Collection from "@/lib/models/Collection";

export const POST = async (req: NextRequest) => {
    try {

        const { userId } = auth();

        if (!userId) return NextResponse.json({ message: "Unauthorized user" }, { status: 403 })
        await connectToDB();

        const { title, description, image } = await req.json();


        const existingCollection = await Collection.findOne({ title });

        if (existingCollection) return new NextResponse("Collection already exist ", { status: 400 })
        if (!title || !image) return new NextResponse("Title and Image is required", { status: 400 })

        const newCollection = await Collection.create({
            title,
            description,
            image,
        })

        await newCollection.save();
        return NextResponse.json(newCollection, { status: 200 });
    } catch (error) {
        console.error("[collection_post]", error);
        return new NextResponse("Collection post failed", { status: 500 })
    }
}

export const GET = async () => {

    try {
        await connectToDB();
        const collections = await Collection.find().sort({ createdAt: "desc" })
        return NextResponse.json(collections, { status: 200 })
    } catch (error) {
        console.error("[collection_GET]", error);
        return new NextResponse("Collection Get failed", { status: 500 })

    }

}

export const dynamic = "force-dynamic"