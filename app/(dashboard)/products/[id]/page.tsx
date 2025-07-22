import { use } from 'react';
import { notFound } from 'next/navigation';

interface ProductPageProps {
    params: {
        id: string;
    };
}

export default function SalesOrderPage({ params }: ProductPageProps) {
    const { id } = params;

    // You can fetch the data here with fetch(), get data from DB, etc.
    // const order = await fetchOrderById(id);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold">Product #{id}</h1>
            {/* Render more data here */}
        </div>
    );
}
