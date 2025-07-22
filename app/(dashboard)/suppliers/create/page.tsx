'use client';
import { use, useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
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

const initialSupplierState: DbSupplier = {
    unique_key: 0,
    client: '',
    supplier_code: '',
    supplier_name: '',
    supplier_address_1: '',
    supplier_address_2: '',
    supplier_suburb: '',
    supplier_state: '',
    supplier_postcode: '',
    supplier_country: '',
};

export default function SuppliersPage() {
    const [data, setData] = useState<DbSupplier>(initialSupplierState);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const handleChange = (field: keyof DbSupplier) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!data) return;

        const value =
            field === 'supplier_code'
                ? event.target.value.toUpperCase()
                : event.target.value;

        setData({ ...data, [field]: value });
    };

    const handleSubmit = async () => {
        if (!data) return;

        setSubmitting(true);
        try {
            await api.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/websupplier`,
                data
            );
            alert('Supplier added successfully');
            router.push(`/suppliers`)
        } catch (err) {
            console.error('Submit error', err);
            alert('Failed to add supplier');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{
            mt: 4,
            minHeight: '80vh',
            ml: 0,
            pl: 0, // optional: remove left padding
            pr: 0, // optional: remove right padding
        }}>
            <Typography variant="h5" gutterBottom>
                Create New supplier
            </Typography>
            <Box component="form" display="flex" flexDirection="column" gap={2} sx={{ mt: 2 }}>
                <TextField
                    label="Customer Code"
                    value={data.supplier_code || ''}
                    onChange={handleChange('supplier_code')}
                    InputProps={{
                        style: { textTransform: 'uppercase' }
                    }}
                />
                <TextField
                    label="Supplier Name"
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
                    value={data.supplier_country || ''}
                    onChange={handleChange('supplier_country')}
                />

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? 'Saving...' : 'Add Supplier'}
                </Button>
            </Box>
        </Container >
    );
}
