import { NextRequest, NextResponse } from "next/server"
import Product from "@/lib/models/Products"


export const GET = async (req: NextRequest, { params }: { params: { query: string } }) => {
    const { query } = params

    try {
        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } },
                { tags: { $in: [new RegExp(query, "i")] } },
            ],
        })
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error("[search_GET]", error)
        return new NextResponse("Search failed", { status: 500 })
    }
}

export const dynamic = "force-dynamic"
