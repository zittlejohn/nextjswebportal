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
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { stockColumns, stockSummarisedColumns } from '@/app/wmsdata/GridStockData';
import { Typography, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';


export default function StockPage() {

    const [data, setData] = useState<any>(null)
    const [value, setValue] = useState<string>('summarised');
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
            const description = row.sku_description?.toLowerCase() || '';
            return sku.includes(term) || description.includes(term);
        });
    }, [searchTerm, data]);

    useEffect(() => {
        let isMounted = true;

        async function getData() {
            const isDev = process.env.NODE_ENV !== 'production';
            const httpsAgent = isDev ? new https.Agent({ rejectUnauthorized: false }) : undefined;

            try {
                const { data } = await api.get<any>(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/webstock?view=${value}`,
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

    return (
        <PageContainer sx={{ minWidth: '100%' }}>
            <Box sx={{ mb: 2 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="demo-simple-select-label">View By</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={value}
                        onChange={handleChange}
                    >
                        <MenuItem value="summarised">Summarised</MenuItem>
                        <MenuItem value="records">Records</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    label="Search by SKU or SKU Description"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </Box>

            {value === 'records' && (
                <>
                    {filteredData && <CustomDataGrid rows={filteredData} columns={stockColumns} rowLinkPrefix='' />}
                </>
            )}
            {value === 'summarised' && (
                <>
                    {filteredData && <CustomDataGrid rows={filteredData} columns={stockSummarisedColumns} rowLinkPrefix='' />}
                </>
            )}
        </PageContainer>
    );
}
