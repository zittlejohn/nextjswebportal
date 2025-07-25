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

interface SalesOrderPageProps {
    params: Promise<{ id: string }>; // Note: params is now a Promise
}

interface SalesOrderDataProps {
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

const SalesOrderData: React.FC<SalesOrderDataProps> = ({
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
                        📦 Sales Order {data.orderNumber}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        This page displays key details of the Sales Order, all ordered items, their quantities, scan data, serial numbers and fulfillment status.
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
                                    <Typography variant="body2"><b>Order Released</b></Typography>
                                    <Typography variant="body2">{data.orderReleased}</Typography>
                                    <Typography variant="body2"><b>Order Completed:</b></Typography>
                                    <Typography variant="body2">{data.orderCompleted}</Typography>
                                    {/* <Typography variant="body2"><b>Order Despatched:</b></Typography>
                                    <Typography variant="body2">{data.orderDespatch}</Typography> */}
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Customer</Typography>
                                    <Typography variant="body2"><b>Customer Name:</b></Typography>
                                    <Typography variant="body2">{data.customerName}</Typography>
                                    <Typography variant="body2"><b>Shipping Address:</b></Typography>
                                    <Typography variant="body2">{data.customerAddress1}, {data.customerAddress2}</Typography>
                                    <Typography variant="body2">{data.customerSuburb}, {data.customerState}, {data.customerPostcode}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Logistics</Typography>
                                    <Typography variant="body2"><b>Carrier:</b></Typography>
                                    <Typography variant="body2">{data.despatchMethod}</Typography>
                                    <Typography variant="body2"><b>Tracking Number:</b></Typography>
                                    <Typography variant="body2">{data.trackingNumber === null ? 'N/A' : data.trackingNumber}</Typography>
                                    <Typography variant="body2"><b>Tracking Status:</b></Typography>
                                    <Typography variant="body2">{data.trackingStatus === null ? 'N/A' : data.trackingStatus}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    <Card sx={{ mb: 4 }}>
                        <CardContent>
                            <Typography sx={{ mb: 1 }} variant="h6">Order Lines</Typography>
                            <CustomDataGrid rows={data.lines} columns={salesOrderLinesColumns} rowLinkPrefix='' />
                        </CardContent>
                    </Card>

                    <Card sx={{ mb: 4 }}>
                        <CardContent>
                            <Typography sx={{ mb: 1 }} variant="h6">Scan Data</Typography>
                            <CustomDataGrid rows={data.scanData} columns={scanPackDataColumns} rowLinkPrefix='' />
                        </CardContent>
                    </Card>

                    <Card sx={{ mb: 4 }}>
                        <CardContent>
                            <Typography sx={{ mb: 1 }} variant="h6">SSCC Labels</Typography>
                            <CustomDataGrid rows={data.sscc} columns={ssccLabelDataColumns} rowLinkPrefix='' />
                        </CardContent>
                    </Card>

                    <Card sx={{ mb: 4 }}>
                        <CardContent>
                            <Typography sx={{ mb: 1 }} variant="h6">Serial Numbers</Typography>
                            <CustomDataGrid rows={data.serials} columns={serialDataColumns} rowLinkPrefix='' />
                        </CardContent>
                    </Card>
                </>
            }
        </Box>
    );
};

export default function SalesOrderPage({ params }: SalesOrderPageProps) {

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
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/websalesorder/${id}`,
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
        <SalesOrderData
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
        // <Box p={4} mx="auto">
        //     <Typography variant="h4" gutterBottom>
        //         📦 Sales Order SO-{id}
        //     </Typography>

        //     <Typography variant="body1" paragraph>
        //         At FLSA, we understand that every business operates differently — which is why our Warehouse Management System (WMS) is built for <strong>flexibility, reliability, and ease of integration</strong>. Whether you're looking to automate workflows, improve data accuracy, or speed up order processing, we make it simple to connect your systems to ours.
        //     </Typography>

        //     <Divider sx={{ my: 4 }} />

        //     <Card sx={{ mb: 4 }}>
        //         <CardContent>
        //             <List>
        //                 <ListItem>
        //                     <ListItemIcon sx={{ mr: 2 }}>
        //                         <ApiIcon color="primary" />
        //                     </ListItemIcon>
        //                     <ListItemText
        //                         primary="API Integration"
        //                         secondary="REST API for real-time connectivity. Ideal for ERPs, CRMs, or eCommerce platforms."
        //                     />
        //                 </ListItem>
        //                 <ListItem>
        //                     <ListItemIcon sx={{ mr: 2 }}>
        //                         <StorageIcon color="primary" />
        //                     </ListItemIcon>
        //                     <ListItemText
        //                         primary="File-Based Integration"
        //                         secondary="Supports CSV, XML, or TXT files via FTP or secure SFTP. Perfect for batch processing."
        //                     />
        //                 </ListItem>
        //                 <ListItem>
        //                     <ListItemIcon sx={{ mr: 2 }}>
        //                         <BuildIcon color="primary" />
        //                     </ListItemIcon>
        //                     <ListItemText
        //                         primary="Custom Solutions"
        //                         secondary="Tailored workflows, hybrid API+file sync, and flexible data mapping options."
        //                     />
        //                 </ListItem>
        //             </List>
        //         </CardContent>
        //     </Card>

        //     <Typography variant="h6" gutterBottom>
        //         🔒 Security Comes First
        //     </Typography>
        //     <List>
        //         <ListItem>
        //             <ListItemIcon>
        //                 <LockIcon color="action" />
        //             </ListItemIcon>
        //             <ListItemText primary="Encrypted SFTP channels" />
        //         </ListItem>
        //         <ListItem>
        //             <ListItemIcon>
        //                 <LockIcon color="action" />
        //             </ListItemIcon>
        //             <ListItemText primary="Token-based API authentication" />
        //         </ListItem>
        //         <ListItem>
        //             <ListItemIcon>
        //                 <LockIcon color="action" />
        //             </ListItemIcon>
        //             <ListItemText primary="IP whitelisting and access control" />
        //         </ListItem>
        //     </List>

        //     <Divider sx={{ my: 4 }} />

        //     <Typography variant="h6" gutterBottom>
        //         🛠️ Ready to Connect?
        //     </Typography>
        //     <Typography variant="body1">
        //         Whether you're a tech-savvy business looking for a RESTful API or prefer a more traditional file-based setup, we’ve got you covered.
        //         <br /><br />
        //         <strong>Let’s discuss the best integration option for your operations.</strong> Our team is happy to guide you through the onboarding process and provide technical documentation or sandbox access.
        //         <br /><br />
        //         Contact<strong> dan@flsa.com.au</strong> to get started.
        //     </Typography>
        // </Box>
    );
}
