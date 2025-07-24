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
import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { stockColumns } from '@/app/wmsdata/GridStockData';
import { productColumns } from '@/app/wmsdata/GridProductData';
import { customerColumns } from '@/app/wmsdata/GridCustomerData';
import { auditColumns } from '@/app/wmsdata/GridAuditData';

export default function AuditPage() {

    const [data, setData] = useState<any>(null)
    const [searchTerm, setSearchTerm] = useState<string>(''); // Track search input

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    /// Filter data by SKU
    const filteredData = React.useMemo(() => {
        if (!data) return [];

        if (searchTerm.trim() === '') return data;

        const term = searchTerm.toLowerCase().trim();

        return data.filter((row: any) => {
            const sku = row.sku?.toLowerCase() || '';
            const orderNumber = row.order_no?.toLowerCase() || '';
            const clientReference = row.customer_ref?.toLowerCase() || '';
            return sku.includes(term) || orderNumber.includes(term) || clientReference.includes(term);
        });
    }, [searchTerm, data]);

    useEffect(() => {
        let isMounted = true;

        async function getData() {
            const isDev = process.env.NODE_ENV !== 'production';
            const httpsAgent = isDev ? new https.Agent({ rejectUnauthorized: false }) : undefined;

            try {
                const { data } = await api.get<any>(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/webaudit`,
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
                        <TextField
                            fullWidth
                            label="Search by Sku, Order Number, Client Reference"
                            variant="outlined"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </Box>
                    {filteredData && <CustomDataGrid rows={filteredData} columns={auditColumns} rowLinkPrefix='' />}</>
                :
                <><CircularProgress /></>}
        </PageContainer>
    );
}
