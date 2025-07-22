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

interface DbCustomer {
    unique_key: number;
    client?: string;
    customer_code?: string;
    customer_name?: string;
    customer_address_1?: string;
    customer_address_2?: string;
    customer_suburb?: string;
    customer_state?: string;
    customer_postcode?: string;
    customer_country?: string;
}

const initialCustomerState: DbCustomer = {
    unique_key: 0,
    client: '',
    customer_code: '',
    customer_name: '',
    customer_address_1: '',
    customer_address_2: '',
    customer_suburb: '',
    customer_state: '',
    customer_postcode: '',
    customer_country: '',
};

export default function CustomersPage() {
    const [data, setData] = useState<DbCustomer>(initialCustomerState);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const handleChange = (field: keyof DbCustomer) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!data) return;

        const value =
            field === 'customer_code'
                ? event.target.value.toUpperCase()
                : event.target.value;

        setData({ ...data, [field]: value });
    };


    const handleSubmit = async () => {
        if (!data) return;

        setSubmitting(true);
        try {
            await api.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/webcustomer`,
                data
            );
            alert('Customer added successfully');
            router.push(`/customers`)
        } catch (err) {
            console.error('Submit error', err);
            alert('Failed to add customer');
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
                Create New Customer
            </Typography>
            <Box component="form" display="flex" flexDirection="column" gap={2} sx={{ mt: 2 }}>
                <TextField
                    label="Customer Code"
                    value={data.customer_code || ''}
                    onChange={handleChange('customer_code')}
                    InputProps={{
                        style: { textTransform: 'uppercase' }
                    }}
                />
                <TextField
                    label="Customer Name"
                    value={data.customer_name || ''}
                    onChange={handleChange('customer_name')}
                />
                <TextField
                    label="Address Line 1"
                    value={data.customer_address_1 || ''}
                    onChange={handleChange('customer_address_1')}
                />
                <TextField
                    label="Address Line 2"
                    value={data.customer_address_2 || ''}
                    onChange={handleChange('customer_address_2')}
                />
                <TextField
                    label="Suburb"
                    value={data.customer_suburb || ''}
                    onChange={handleChange('customer_suburb')}
                />
                <TextField
                    label="State"
                    value={data.customer_state || ''}
                    onChange={handleChange('customer_state')}
                />
                <TextField
                    label="Postcode"
                    value={data.customer_postcode || ''}
                    onChange={handleChange('customer_postcode')}
                />
                <TextField
                    label="Country"
                    value={data.customer_country || ''}
                    onChange={handleChange('customer_country')}
                />

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? 'Saving...' : 'Add Customer'}
                </Button>
            </Box>
        </Container >
    );
}
