'use client';
import * as React from 'react';
import { PageContainer } from '@toolpad/core/PageContainer';
import CustomDataGrid from '../../components/CustomDataGrid';
import { salesOrderColumns, salesOrderRows } from '@/app/wmsdata/GridSalesOrdersData';
import https from 'https'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import api from '../../lib/axios'
import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { stockColumns } from '@/app/wmsdata/GridStockData';
import { productColumns } from '@/app/wmsdata/GridProductData';
import { customerColumns } from '@/app/wmsdata/GridCustomerData';
import { supplierColumns } from '@/app/wmsdata/GridSupplierData';
import { useRouter } from 'next/navigation';

export default function SuppliersPage() {

    const [data, setData] = useState<any>(null)
    const [searchTerm, setSearchTerm] = useState<string>(''); // Track search input
    const router = useRouter();

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    /// Filter data by SKU
    const filteredData = React.useMemo(() => {
        if (!data) return [];

        if (searchTerm.trim() === '') return data;

        const term = searchTerm.toLowerCase().trim();

        return data.filter((row: any) => {
            const code = row.customer_code?.toLowerCase() || '';
            const name = row.customer_name?.toLowerCase() || '';
            return code.includes(term) || name.includes(term);
        });
    }, [searchTerm, data]);

    useEffect(() => {
        let isMounted = true;

        async function getData() {
            const isDev = process.env.NODE_ENV !== 'production';
            const httpsAgent = isDev ? new https.Agent({ rejectUnauthorized: false }) : undefined;

            try {
                const { data } = await api.get<any>(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/websupplier`,
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
    }, []);

    return (
        <PageContainer sx={{ minWidth: '100%' }}>
            {data ?
                <>
                    <Box sx={{ mb: 2 }}>
                        <Button sx={{ mb: 2 }} variant="contained" onClick={() => router.push(`/suppliers/create`)}>New Supplier</Button>

                        <TextField
                            fullWidth
                            label="Search by Supplier Name or Code"
                            variant="outlined"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </Box>
                    <Typography sx={{ mb: 1 }}>Double Click on a row to view details.</Typography>
                    {filteredData && <CustomDataGrid rows={filteredData} columns={supplierColumns} rowLinkPrefix='suppliers' />}
                </>
                :
                <>
                    <CircularProgress />
                </>}
        </PageContainer>
    );
}
