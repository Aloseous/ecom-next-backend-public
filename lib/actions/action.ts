import { connectToDB } from "../connectToDB";
import Customer from "../models/Customer";
import Order from "../models/Order";



export const getSales = async () => {
    await connectToDB();
    const orders = await Order.find();
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    return { totalOrders, totalRevenue };
}

export const getCustomers = async () => {
    await connectToDB();
    const customers = await Customer.find();
    return customers.length;
}

export const getSalesPerMonth = async () => {
    await connectToDB();
    const orders = await Order.find();
    const salesByMonth = orders.reduce((acc, order) => {
        const month = new Date(order.createdAt).getMonth();
        acc[month] = (acc[month] || 0) + order.totalAmount;
        return acc;
    }, {});

    const graphData = Array.from({ length: 12 }, (_, i) => {
        const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(2024, i, 1));
        return {
            name: month,
            value: salesByMonth[i] || 0
        }
    })
    return graphData
}


