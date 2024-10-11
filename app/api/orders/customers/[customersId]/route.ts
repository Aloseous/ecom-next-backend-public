import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/connectToDB";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Products";

export const GET = async (request: NextRequest, { params }: { params: { customerId: string } }) => {
    try {
        await connectToDB();
        const orders = await Order.find({ clerkId: params.customerId }).populate({ path: "products.product", model: Product });

        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        console.error("[orders_GET]", error);
        return new NextResponse("Orders Get failed", { status: 500 });
    }
}