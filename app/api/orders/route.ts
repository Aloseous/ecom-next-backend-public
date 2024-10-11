import { connectToDB } from "@/lib/connectToDB";
import { NextResponse } from "next/server";
import { format } from "date-fns";
import Order from "@/lib/models/Order";
import Customer from "@/lib/models/Customer";


export const GET = async () => {
    try {
        await connectToDB();

        const orders = await Order.find({}).sort({ createdAt: "desc" });



        const orderDetails = await Promise.all(orders.map(async (order) => {
            const customer = await Customer.findOne({ clerkId: order.customerClerkId })
            return {
                _id: order._id,
                customer: customer.name,
                products: order.products.length,
                totalAmount: order.totalAmount,
                createdAt: format(order.createdAt, "dd/MM/yyyy"),
            }
        }))
        return NextResponse.json(orderDetails, { status: 200 });
    } catch (error) {
        console.error("[orders_GET]", error);
        return new NextResponse("Orders Get failed", { status: 500 });
    }
}

export const dynamic = "force-dynamic"