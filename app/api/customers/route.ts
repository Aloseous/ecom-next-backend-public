
import Customer from "@/lib/models/Customer";
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/connectToDB";

export const GET = async () => {
    try {
        await connectToDB();
        const customers = await Customer.find({}).sort({ createdAt: "desc" });
        return NextResponse.json(customers, { status: 200 });
    } catch (error) {
        console.error("[customers_GET]", error);
        return new NextResponse("Customers Get failed", { status: 500 });
    }
}

export const dynamic = "force-dynamic"
