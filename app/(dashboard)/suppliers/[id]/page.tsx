'use client';
import { use, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import https from 'https';
import api from '../../../lib/axios';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    TextField,
    Typography,
} from '@mui/material';

interface DbSupplier {
    unique_key: number;
    client?: string;
    supplier_code?: string;
    supplier_name?: string;
    supplier_address_1?: string;
    supplier_address_2?: string;
    supplier_suburb?: string;
    supplier_state?: string;
    supplier_postcode?: string;
    supplier_country?: string;
}

interface SuppliersPageProps {
    params: Promise<{ id: string }>; // Note: params is now a Promise
}

export default function SuppliersPage({ params }: SuppliersPageProps) {
    const { id } = use(params);
    const [data, setData] = useState<DbSupplier | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function getData() {
            const isDev = process.env.NODE_ENV !== 'production';
            const httpsAgent = isDev ? new https.Agent({ rejectUnauthorized: false }) : undefined;

            if (!id) return;

            try {
                const { data } = await api.get<DbSupplier>(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/websupplier/${id}`,
                    { httpsAgent }
                );
                if (isMounted) {
                    setData(data);
                }
            } catch (err) {
                console.error('Data fetch error', err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        getData();

        return () => {
            isMounted = false;
        };
    }, [id]);

    const handleChange = (field: keyof DbSupplier) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!data) return;
        setData({ ...data, [field]: event.target.value });
    };

    const handleSubmit = async () => {
        if (!data) return;

        setSubmitting(true);
        try {
            await api.put(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/websupplier`,
                data
            );
            alert('Supplier updated successfully');
        } catch (err) {
            console.error('Submit error', err);
            alert('Failed to update supplier');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (!data) {
        return notFound();
    }

    return (
        <Container maxWidth="sm" sx={{
            mt: 4,
            minHeight: '80vh',
            ml: 0,
            pl: 0, // optional: remove left padding
            pr: 0, // optional: remove right padding
        }}>
            <Typography variant="h5" gutterBottom>
                Edit supplier #{data.supplier_code}
            </Typography>
            <Box component="form" display="flex" flexDirection="column" gap={2} sx={{ mt: 2 }}>
                <TextField
                    label="supplier Code"
                    value={data.supplier_code || ''}
                    disabled={true}
                    onChange={handleChange('supplier_code')}
                />
                <TextField
                    label="supplier Name"
                    value={data.supplier_name || ''}
                    onChange={handleChange('supplier_name')}
                />
                <TextField
                    label="Address Line 1"
                    value={data.supplier_address_1 || ''}
                    onChange={handleChange('supplier_address_1')}
                />
                <TextField
                    label="Address Line 2"
                    value={data.supplier_address_2 || ''}
                    onChange={handleChange('supplier_address_2')}
                />
                <TextField
                    label="Suburb"
                    value={data.supplier_suburb || ''}
                    onChange={handleChange('supplier_suburb')}
                />
                <TextField
                    label="State"
                    value={data.supplier_state || ''}
                    onChange={handleChange('supplier_state')}
                />
                <TextField
                    label="Postcode"
                    value={data.supplier_postcode || ''}
                    onChange={handleChange('supplier_postcode')}
                />
                <TextField
                    label="Country"
                    value={data.supplier_postcode || ''}
                    onChange={handleChange('supplier_country')}
                />

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? 'Saving...' : 'Save Changes'}
                </Button>
            </Box>
        </Container >
    );
}
