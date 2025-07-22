import { use } from 'react';
import { notFound } from 'next/navigation';

interface CustomersPageProps {
    params: Promise<{ id: string }>; // Note: params is now a Promise
}


export default function SalesOrderPage({ params }: CustomersPageProps) {
    const { id } = use(params); // ✅ Correct way in Next.js App Router

    // You can fetch the data here with fetch(), get data from DB, etc.
    // const order = await fetchOrderById(id);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold">Customers #{id}</h1>
            {/* Render more data here */}
        </div>
    );
}
