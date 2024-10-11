import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/connectToDB";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Products";
import Customer from "@/lib/models/Customer";

export const GET = async (request: NextRequest, { params }: { params: { orderId: string } }) => {
    try {
        await connectToDB();
        const orderDetails = await Order.findById(params.orderId).populate({ path: "products.product", model: Product });
        if (!orderDetails) return new NextResponse("Order not found", { status: 404 });

        const customerDetails = await Customer.findOne({ clerkId: orderDetails.customerClerkId });
        return NextResponse.json({ orderDetails, customerDetails }, { status: 200 });
    } catch (error) {
        console.error("[order_GET]", error);
        return new NextResponse("Order Get failed", { status: 500 });
    }
}

export const dynamic = "force-dynamic"