
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(req: NextRequest) {
    const { cartItems, customer } = await req.json();
    try {

        if (!cartItems || !customer) return new NextResponse("Not enough details", { status: 400 })
    } catch (error) {
        console.error("[checkout post]", error);
        return new NextResponse("Server error", { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        shipping_address_collection: { allowed_countries: ["IN", "US"] },
        shipping_options: [{ shipping_rate: "shr_1Q6OGeSAt3Qd9XXLBzBXc5sa" }, { shipping_rate: "shr_1Q6OGBSAt3Qd9XXLuNfdWy4b" }, { shipping_rate: "shr_1Q6OFRSAt3Qd9XXL1fgJdmuX" }, { shipping_rate: "shr_1Q6OEkSAt3Qd9XXLwoulsovf" }],
        line_items: cartItems.map((cartItems: any) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: cartItems.item.title,
                    metadata: {
                        productId: cartItems.item._id,
                        ...(cartItems.size && { size: cartItems.size }),
                        ...(cartItems.color && { color: cartItems.color }),
                    },
                },
                unit_amount: cartItems.item.price * 100,
            },
            quantity: cartItems.quantity,
        }
        )),
        client_reference_id: customer.clerkId,
        success_url: `${process.env.ECOM_STORE_URL}/payment_success`,
        cancel_url: `${process.env.ECOM_STORE_URL}/cart`
    })

    return NextResponse.json(session, { headers: corsHeaders });

}