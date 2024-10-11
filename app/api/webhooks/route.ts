import { connectToDB } from "@/lib/connectToDB";
import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import { stripe } from "@/lib/stripe";
export const POST = async (req: Request) => {

    try {
        const rawBody = await req.text();
        const signature = req.headers.get("Stripe-Signature") as string;
        const event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);

        if (event.type === "checkout.session.completed") {
            const session = event.data.object;

            const customerInfo = {
                clerkId: session.client_reference_id,
                name: session?.customer_details?.name,
                email: session?.customer_details?.email,
            }

            const shippingAddress = {
                street: session?.customer_details?.address?.line1,
                streetName: session?.customer_details?.address?.line2,
                city: session?.customer_details?.address?.city,
                state: session?.customer_details?.address?.state,
                country: session?.customer_details?.address?.country,
                postalCode: session?.customer_details?.address?.postal_code
            }

            const retriveSession = await stripe.checkout.sessions.retrieve(
                session.id,
                { expand: ["line_items.data.price.product"] }
            );

            const lineItems = retriveSession?.line_items?.data;

            const orderItems = lineItems?.map((item: any) => {
                return {
                    product: item?.price?.product?.metadata?.productId,
                    quantity: item?.quantity,
                    size: item?.price?.product?.metadata?.size || "N/A",
                    color: item?.price?.product?.metadata?.color || "N/A"
                }
            });

            await connectToDB();

            const newOrder = new Order({
                customerClerkId: customerInfo.clerkId,
                shippingAddress,
                products: orderItems,
                shippingFee: session?.shipping_cost?.shipping_rate,
                totalAmount: session.amount_total ? session.amount_total / 100 : 0,
            });

            await newOrder.save();

            let customer = await Customer.findOne({ clerkId: customerInfo.clerkId });
            if (customer) {
                customer.orders.push(newOrder._id);
            } else {
                customer = new Customer({
                    ...customerInfo, orders: [newOrder._id],
                })
            }

            await customer.save();
        }
        return new Response("Order created", { status: 200 });


    } catch (error) {
        console.error("[webhooks]", error);
        return new Response("Failed to create order", { status: 400 });
    }
}

export const dynamic = "force-dynamic"