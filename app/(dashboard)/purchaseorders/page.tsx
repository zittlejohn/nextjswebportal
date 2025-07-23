'use client';
import * as React from 'react';
import { PageContainer } from '@toolpad/core/PageContainer';
import CustomDataGrid from '../../components/CustomDataGrid';
import https from 'https';
import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography, // <-- Import for search
} from '@mui/material';
import { purchaseOrderColumns } from '@/app/wmsdata/GridPurchaseOrdersData';
import { useRouter } from 'next/navigation';

export default function PurchaseOrdersPage() {
    const [data, setData] = useState<any>(null);
    const [value, setValue] = useState<string>('active');
    const [searchTerm, setSearchTerm] = useState<string>(''); // <-- New state

    const router = useRouter();

    // Filter data by SKU
    const filteredData = React.useMemo(() => {
        if (!data) return [];

        if (searchTerm.trim() === '') return data;

        const term = searchTerm.toLowerCase().trim();

        return data.filter((row: any) => {
            const orderNumber = row.orderNumber?.toLowerCase() || '';
            const clientReference = row.clientReference?.toLowerCase() || '';
            return orderNumber.includes(term) || clientReference.includes(term);
        });
    }, [searchTerm, data]);

    useEffect(() => {
        let isMounted = true;

        async function getData() {
            const isDev = process.env.NODE_ENV !== 'production';
            const httpsAgent = isDev ? new https.Agent({ rejectUnauthorized: false }) : undefined;

            try {
                const { data } = await api.get<any>(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/webpurchaseorder?status=${value}`,
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
    }, [value]);

    const handleChange = (event: SelectChangeEvent) => {
        setValue(event.target.value);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <PageContainer sx={{ minWidth: '100%' }}>
            <Box sx={{ mb: 2 }}>
                <Button sx={{ mb: 2 }} onClick={() => router.push(`/purchaseorders/create`)} variant="contained">New Purchase Order</Button>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="demo-simple-select-label">Order Status</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={value}
                        onChange={handleChange}
                    >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="unreleased">Unreleased</MenuItem>
                        <MenuItem value="released">Released</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="all">All</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    label="Search by Order Number or Client Reference"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <Typography sx={{ mt: 1 }}>Double Click on a row to view details.</Typography>
            </Box>
            {filteredData && <CustomDataGrid rows={filteredData} columns={purchaseOrderColumns} rowLinkPrefix='purchaseorders' />}
        </PageContainer>
    );
}
