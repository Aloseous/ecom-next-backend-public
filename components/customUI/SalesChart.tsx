"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalesChart = ({ data }: { data: any[] }) => {

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart className='w-full h-full'
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="5 5" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
        </ResponsiveContainer>
    )
}

export default SalesChart