'use client';
import { use, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { Box, Typography, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Divider, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import ApiIcon from '@mui/icons-material/Api';
import StorageIcon from '@mui/icons-material/Storage';
import BuildIcon from '@mui/icons-material/Build';
import https from 'https';
import api from '../../../lib/axios';
import CustomDataGrid from '@/app/components/CustomDataGrid';
import { salesOrderLinesColumns } from '@/app/wmsdata/GridSalesOrderLinesData';
import { scanPackDataColumns } from '@/app/wmsdata/GridScanPackData';
import { ssccLabelDataColumns } from '@/app/wmsdata/GridSsccLabelData';
import { serialDataColumns } from '@/app/wmsdata/GridSerialData';
import { purchaseOrderLinesColumns } from '@/app/wmsdata/GridPurchaseOrderLinesData';

interface PurchaseOrderPageProps {
    params: Promise<{ id: string }>; // Note: params is now a Promise
}

interface PurchaseOrderDataProps {
    id: string;
    orderDate?: string;
    customerName?: string;
    status?: string;
    reference?: string;
    shippingAddress?: string;
    deliveryDate?: string;
    createdBy?: string;
    data: any;
}

const PurchaseOrderData: React.FC<PurchaseOrderDataProps> = ({
    id = '1',
    orderDate = '17/07/2025',
    customerName = 'Example Customer Pty Ltd',
    status = 'Pending',
    reference = 'REF-001234',
    shippingAddress = '123 Example Street, Sydney, NSW 2000',
    deliveryDate = '20/07/2025',
    createdBy = 'sales@flsa.com.au',
    data = null
}) => {
    return (
        <Box p={4}>
            {data &&
                <>
                    <Typography variant="h4" gutterBottom>
                        📦 Purchase Order PO-{id}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        This page displays key details of the Purchase Order, all ordered items, their quantities, scan data, serial numbers and fulfillment status.
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid>
                            <Card sx={{ minWidth: '15vw' }}>
                                <CardContent>
                                    <Typography variant="h6">Order Details</Typography>
                                    <Typography variant="body2"><b>Order Date:</b></Typography>
                                    <Typography variant="body2">{data.orderNumber}</Typography>
                                    <Typography variant="body2"><b>Reference:</b></Typography>
                                    <Typography variant="body2">{data.clientReference}</Typography>
                                    <Typography variant="body2"><b>Status:</b></Typography>
                                    <Typography variant="body2">{data.status}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Order Info</Typography>
                                    <Typography variant="body2"><b>Order Date:</b></Typography>
                                    <Typography variant="body2">{data.orderDate}</Typography>
                                    {/* <Typography variant="body2"><b>Order Released</b></Typography>
                                    <Typography variant="body2">{data.orderReleased}</Typography> */}
                                    <Typography variant="body2"><b>Order Completed:</b></Typography>
                                    <Typography variant="body2">{data.orderCompleted}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Supplier</Typography>
                                    <Typography variant="body2"><b>Supplier Name:</b></Typography>
                                    <Typography variant="body2">{customerName}</Typography>
                                    <Typography variant="body2"><b>Supplier Address:</b></Typography>
                                    <Typography variant="body2">{data.customerAddress1}, {data.customerAddress2}</Typography>
                                    <Typography variant="body2">{data.customerSuburb}, {data.customerState}, {data.customerPostcode}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    <Card sx={{ mb: 4 }}>
                        <CardContent>
                            <Typography sx={{ mb: 1 }} variant="h6">Order Lines</Typography>
                            <CustomDataGrid rows={data.lines} columns={purchaseOrderLinesColumns} rowLinkPrefix='' />
                        </CardContent>
                    </Card>

                    <Card sx={{ mb: 4 }}>
                        <CardContent>
                            <Typography sx={{ mb: 1 }} variant="h6">Receipts</Typography>
                            <CustomDataGrid rows={data.receipts} columns={purchaseOrderLinesColumns} rowLinkPrefix='' />
                        </CardContent>
                    </Card>
                </>
            }
        </Box>
    );
};

export default function PurchaseOrderPage({ params }: PurchaseOrderPageProps) {

    const { id } = use(params); // ✅ Correct way in Next.js App Router

    // You can fetch the data here with fetch(), get data from DB, etc.
    // const order = await fetchOrderById(id);

    const [data, setData] = useState<any>(null)

    useEffect(() => {
        let isMounted = true;

        async function getData() {
            const isDev = process.env.NODE_ENV !== 'production';
            const httpsAgent = isDev ? new https.Agent({ rejectUnauthorized: false }) : undefined;

            if (!id)
                return

            try {
                const { data } = await api.get<any>(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/webpurchaseorder/${id}`,
                    { httpsAgent },
                );

                if (isMounted && data) {
                    setData(data);
                }
            } catch (err) {
                if (isMounted) {
                    console.error('Data error', err);
                }
            }
        }

        getData();

        return () => {
            isMounted = false;
        };
    }, [id]);

    return (
        <PurchaseOrderData
            orderDate="17/07/2025"
            customerName="Global Traders Pty Ltd"
            status="Confirmed"
            reference="GT-SO-98765"
            shippingAddress="45 Wharf Rd, Melbourne, VIC 3000"
            deliveryDate="22/07/2025"
            createdBy="emma@flsa.com.au"
            id={id}
            data={data}
        />
    );
}
