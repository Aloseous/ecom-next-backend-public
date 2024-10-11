import { DataTable } from '@/components/customUI/DataTable';
import { columns } from '@/components/orderItems/OrderItemColumns';
import React from 'react'

const OrderDetail = async ({ params }: { params: { orderId: string } }) => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/${params.orderId}`)

    const { orderDetails, customerDetails } = await res.json()


    const { street, city, state, country, postalCode } = orderDetails.shippingAddress;
    return (
        <div className='flex flex-col gap-4 p-10'>
            <p className='text-base-bold'>Order Id: <span className='text-base-medium'>{orderDetails._id}</span></p>
            <p className='text-base-bold'>Customer Name: <span className='text-base-medium'>{customerDetails.name}</span></p>
            <p className='text-base-bold'>Shipping Address: <span className='text-base-medium'>{street}, {city}, {state}, {country}, {postalCode}</span></p>
            <p className='text-base-bold'>Total Amount: <span className='text-base-medium'>{orderDetails.totalAmount}</span></p>
            <p className='text-base-bold'>Shipping price ID: <span className='text-base-medium'>{orderDetails.shippingFee}</span></p>
            <DataTable columns={columns} data={orderDetails.products} searchKey="_id" />
        </div>
    )
}

export default OrderDetail