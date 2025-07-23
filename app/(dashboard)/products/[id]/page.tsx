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
import { productLinesColumns } from '@/app/wmsdata/GridProductUomData';

interface ProductPageProps {
    params: Promise<{ id: string }>; // Note: params is now a Promise
}

interface ProductDataProps {
    data: any;
}

const ProductData: React.FC<ProductDataProps> = ({
    data = null
}) => {
    return (
        <Box p={4}>
            {data &&
                <>
                    <Typography variant="h4" gutterBottom>
                        📦 {data.sku}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        This page displays key details of the product, including unit of measure and pack sizes.
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid>
                            <Card sx={{ minWidth: '15vw' }}>
                                <CardContent>
                                    <Typography variant="h6">Product Details</Typography>
                                    <Typography variant="body2"><b>Sku:</b></Typography>
                                    <Typography variant="body2">{data.sku}</Typography>
                                    <Typography variant="body2"><b>Description:</b></Typography>
                                    <Typography variant="body2">{data.sku_description}</Typography>
                                    <Typography variant="body2"><b>Base Unit of Measure:</b></Typography>
                                    <Typography variant="body2">{data.live_uom}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">Category Details:</Typography>
                                    <Typography variant="body2"><b>Category 1:</b></Typography>
                                    <Typography variant="body2">{data.sku_category_1 === null ? 'no category' : data.sku_category_1}</Typography>
                                    <Typography variant="body2"><b>Category 2:</b></Typography>
                                    <Typography variant="body2">{data.sku_category_2 === null ? 'no category' : data.sku_category_2}</Typography>
                                    <Typography variant="body2"><b>Category 3:</b></Typography>
                                    <Typography variant="body2">{data.sku_category_3 === null ? 'no category' : data.sku_category_3}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 4 }} />

                    <Card sx={{ mb: 4 }}>
                        <CardContent>
                            <Typography sx={{ mb: 1 }} variant="h6">Unit of Measure / Pack Sizes</Typography>
                            <CustomDataGrid rows={data.details} columns={productLinesColumns} rowLinkPrefix='' />
                        </CardContent>
                    </Card>
                </>
            }
        </Box>
    );
};

export default function ProductPage({ params }: ProductPageProps) {

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
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/webproduct/${id}`,
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
        <ProductData
            data={data}
        />
    );
}
