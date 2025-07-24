'use client';
import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    TextField,
    Checkbox,
    FormControlLabel,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Typography,
    Button,
} from '@mui/material';

import {
    Table, TableHead, TableRow, TableCell, TableBody,
    Autocomplete
} from '@mui/material';

import api from '../../../lib/axios';
import https from 'https';

type SkuRow = {
    sku: string;
    skuDescription: string;
    quantity: number;
    unitOfMeasure: string;
    batch: string;
    serialNumber: string;
    ssccNumber: string;
    options: {
        unitOfMeasures: string[];
        batches: string[];
        serialNumbers: string[];
        ssccNumbers: string[];
    };
};

export interface SalesOrderDetails {
    clientReference: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    addressLine1: string;
    addressLine2: string;
    suburb: string;
    state: string;
    postcode: string;
    country: string;
    specialInstructions: string;
    despatchedBy: string;
    urgent: boolean;
    urgentFreight: boolean;
    packingList: File | null; // 🔹 NEW
}

import countries from '../../../lib/countries'
import { useRouter } from 'next/navigation';

const australianStates = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];
const despatchOptions = ['Warehouse', 'Customer Pickup'];

const SalesOrderPage = () => {
    const [details, setDetails] = useState<SalesOrderDetails>({
        clientReference: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        addressLine1: '',
        addressLine2: '',
        suburb: '',
        state: 'VIC',
        postcode: '',
        country: 'Australia',
        specialInstructions: '',
        despatchedBy: 'Warehouse',
        urgent: false,
        urgentFreight: false,
        packingList: null,
    });

    // const [details, setDetails] = useState<SalesOrderDetails>({
    //     clientReference: 'DL-1654',
    //     customerName: 'Dan Littlejohn',
    //     customerEmail: 'dan@flsa.com.au',
    //     customerPhone: '0497932480',
    //     addressLine1: '31 Koala Street',
    //     addressLine2: '',
    //     suburb: 'Belgrave',
    //     state: 'VIC',
    //     postcode: '3160',
    //     country: 'Australia',
    //     specialInstructions: 'Please be nice about it',
    //     despatchedBy: 'Warehouse',
    //     urgent: false,
    //     urgentFreight: false,
    //     packingList: null,
    // });

    const isDev = process.env.NODE_ENV !== 'production';
    const httpsAgent = isDev ? new https.Agent({ rejectUnauthorized: false }) : undefined;

    const handleChange = (field: keyof SalesOrderDetails, value: any) => {
        setDetails((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    interface SkuData {
        sku: string;
        description: string;
        unitOfMeasures: string[];
        batches: string[];
        serialNumbers: string[];
        ssccNumbers: string[];
    }

    const [skuList, setSkuList] = useState<string[]>([]);

    useEffect(() => {
        async function fetchSkus() {
            try {
                const { data } = await api.get<any>(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/webproduct/skus`,
                    { httpsAgent },
                );

                if (data) {
                    setSkuList(data);
                }
            } catch (err) {
                console.error('Data error', err);
            }
        }
        fetchSkus();
    }, []);

    const [rows, setRows] = useState<SkuRow[]>([
        {
            sku: '',
            skuDescription: '',
            quantity: 0,
            unitOfMeasure: '',
            batch: '',
            serialNumber: '',
            ssccNumber: '',
            options: {
                unitOfMeasures: [],
                batches: [],
                serialNumbers: [],
                ssccNumbers: [],
            },
        },
    ]);

    const [skuDetails, setSkuDetails] = useState<Record<string, SkuData>>({}); // Map SKU -> details

    const handleSkuChange = async (index: number, selectedSku: string) => {
        let found = skuDetails[selectedSku];

        // If we don't have the SKU details cached, fetch them
        if (!found) {

            if (selectedSku === '')
                return

            try {
                const { data } = await api.get<SkuData>(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/webproduct/skudetails?sku=${selectedSku}`,
                    { httpsAgent }
                );
                // Update the skuDetails cache immediately
                setSkuDetails(prev => ({ ...prev, [selectedSku]: data }));
                found = data;  // Use the freshly fetched data directly here
            } catch (error) {
                console.error(`Error fetching details for SKU ${selectedSku}:`, error);
                return; // exit if fetch failed
            }
        }

        if (!found) return; // safety check

        // Clone rows array
        const newRows = [...rows];

        // Update current row with selected SKU info and defaults
        newRows[index] = {
            ...newRows[index],
            sku: found.sku,
            skuDescription: found.description,
            quantity: 1,
            options: {
                unitOfMeasures: found.unitOfMeasures,
                batches: ['no batch', ...found.batches],
                serialNumbers: ['no serial', ...found.serialNumbers],
                ssccNumbers: ['no sscc', ...found.ssccNumbers],
            },
            unitOfMeasure: found.unitOfMeasures[0] || '',
            batch: 'no batch',
            serialNumber: 'no serial',
            ssccNumber: 'no sscc',
        };

        // Check if last row is empty or not
        const lastRow = newRows[newRows.length - 1];
        const isLastRowEmpty = !lastRow.sku;

        // If last row is not empty, add a new blank row
        if (!isLastRowEmpty) {
            newRows.push(createEmptyRow());
        }

        setRows(newRows);
    };

    const handleFieldChange = (index: number, field: keyof SkuRow, value: any) => {
        const newRows = [...rows];
        (newRows[index][field] as any) = value;
        setRows(newRows);
    };

    const createEmptyRow = (): SkuRow => ({
        sku: '',
        skuDescription: '',
        quantity: 1,
        unitOfMeasure: '',
        batch: '',
        serialNumber: '',
        ssccNumber: '',
        options: {
            unitOfMeasures: [],
            batches: [],
            serialNumbers: [],
            ssccNumbers: [],
        },
    });

    const router = useRouter();

    const [saving, setSaving] = useState<boolean>(false)

    const handleSubmit = async () => {
        setSaving(true)

        const orderLines = rows
            .filter((row) => row.sku)
            .map(({ options, ...rest }) => rest);

        if (orderLines.length === 0) {
            alert('You must add at least one SKU to submit the order.');
            setSaving(false)
            return;
        }

        for (let i = 0; i < orderLines.length; i++) {
            const line = orderLines[i];
            if (!line.sku || line.sku.trim() === '') {
                alert(`Line ${i + 1}: SKU is required.`);
                setSaving(false)

                return;
            }
            if (!line.quantity || line.quantity <= 0) {
                alert(`Line ${i + 1}: Quantity must be greater than 0.`);
                setSaving(false)

                return;
            }
        }

        const formData = new FormData();
        formData.append('orderDetails', JSON.stringify({ ...details, packingList: undefined }));
        formData.append('orderLines', JSON.stringify(orderLines));

        if (details.packingList) {
            formData.append('packingList', details.packingList);
        }

        try {
            const { data } = await api.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/websalesorder`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    httpsAgent,
                }
            );

            alert('Order submitted successfully! Order ID: ' + data.id);
            router.push(`/salesorders`);
            setSaving(false)


        } catch (err) {
            console.error('Submission error', err);
            setSaving(false)

            alert('Failed to submit order. See console for details.');
        }
    };


    // const handleSubmit = async () => {
    //     // Remove any rows without SKU
    //     const orderLines = rows
    //         .filter((row) => row.sku)
    //         .map(({ options, ...rest }) => rest);

    //     if (orderLines.length === 0) {
    //         alert('You must add at least one SKU to submit the order.');
    //         return;
    //     }

    //     // Validate each line
    //     for (let i = 0; i < orderLines.length; i++) {
    //         const line = orderLines[i];

    //         if (!line.sku || line.sku.trim() === '') {
    //             alert(`Line ${i + 1}: SKU is required.`);
    //             return;
    //         }

    //         if (!line.quantity || line.quantity <= 0) {
    //             alert(`Line ${i + 1}: Quantity must be greater than 0.`);
    //             return;
    //         }
    //     }

    //     const payload = {
    //         orderDetails: details,
    //         orderLines,
    //     };

    //     try {
    //         const { data } = await api.post<any>(
    //             `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/websalesorder`,
    //             payload,
    //             { httpsAgent }
    //         );

    //         alert('Order submitted successfully! Order ID: ' + data.id);
    //         router.push(`/salesorders`)

    //     } catch (err) {
    //         console.error('Submission error', err);
    //         alert('Failed to submit order. See console for details.');
    //     }
    // };

    const handleRemoveRow = (index: number) => {
        setRows(prevRows => {
            const updated = [...prevRows];
            updated.splice(index, 1);
            return updated.length > 0 ? updated : [createEmptyRow()]; // Always leave at least one row
        });
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            minHeight: '100vh',          // Full viewport height
            overflow: 'hidden',       // Prevent scroll bleed to body
        }}>
            {/* Left 20% */}
            <Box sx={{
                // bgcolor: '#f5f5f5',
                p: 2,
                width: '20%',
                overflowY: 'hidden',    // Prevent scrolling here
            }}>
                <Typography variant="h6" gutterBottom>Sales Order Details</Typography>

                <TextField
                    label="Client Reference"
                    fullWidth
                    margin="dense"
                    value={details.clientReference}
                    onChange={(e) => handleChange('clientReference', e.target.value)}
                />

                <TextField
                    label="Customer Name"
                    fullWidth
                    margin="dense"
                    value={details.customerName}
                    onChange={(e) => handleChange('customerName', e.target.value)}
                />

                <TextField
                    label="Customer Email"
                    fullWidth
                    margin="dense"
                    value={details.customerEmail}
                    onChange={(e) => handleChange('customerEmail', e.target.value)}
                />

                <TextField
                    label="Customer Phone"
                    fullWidth
                    margin="dense"
                    value={details.customerPhone}
                    onChange={(e) => handleChange('customerPhone', e.target.value)}
                />

                <TextField
                    label="Address Line 1"
                    fullWidth
                    margin="dense"
                    value={details.addressLine1}
                    onChange={(e) => handleChange('addressLine1', e.target.value)}
                />

                <TextField
                    label="Address Line 2"
                    fullWidth
                    margin="dense"
                    value={details.addressLine2}
                    onChange={(e) => handleChange('addressLine2', e.target.value)}
                />

                <TextField
                    label="Suburb"
                    fullWidth
                    margin="dense"
                    value={details.suburb}
                    onChange={(e) => handleChange('suburb', e.target.value)}
                />

                {details.country === 'Australia' ? (
                    <FormControl fullWidth margin="dense">
                        <InputLabel>State</InputLabel>
                        <Select
                            value={details.state}
                            onChange={(e) => handleChange('state', e.target.value)}
                            label="State"
                        >
                            {australianStates.map((s) => (
                                <MenuItem key={s} value={s}>{s}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ) : (
                    <TextField
                        label="State / Province / Region"
                        fullWidth
                        margin="dense"
                        value={details.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                    />
                )}

                <TextField
                    label="Postcode"
                    fullWidth
                    margin="dense"
                    value={details.postcode}
                    onChange={(e) => handleChange('postcode', e.target.value)}
                />

                <FormControl fullWidth margin="dense">
                    <InputLabel>Country</InputLabel>
                    <Select
                        value={details.country}
                        onChange={(e) => handleChange('country', e.target.value)}
                        label="Country"
                    >
                        {countries.map((c) => (
                            <MenuItem key={c} value={c}>{c}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Special Instructions"
                    fullWidth
                    margin="dense"
                    value={details.specialInstructions}
                    onChange={(e) => handleChange('specialInstructions', e.target.value)}
                />

                <FormControl fullWidth margin="dense">
                    <InputLabel>Despatched By</InputLabel>
                    <Select
                        value={details.despatchedBy}
                        onChange={(e) => handleChange('despatchedBy', e.target.value)}
                        label="Despatched By"
                    >
                        {despatchOptions.map((option) => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={details.urgent}
                            onChange={(e) => handleChange('urgent', e.target.checked)}
                        />
                    }
                    label="Urgent Pick"
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={details.urgentFreight}
                            onChange={(e) => handleChange('urgentFreight', e.target.checked)}
                        />
                    }
                    label="Urgent Freight"
                />

                <Box mt={2}>
                    <Typography variant="subtitle1">Packing List (Optional)</Typography>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
                        onChange={(e) =>
                            handleChange('packingList', e.target.files?.[0] || null)
                        }
                    />
                    {details.packingList && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Selected: {details.packingList.name}
                        </Typography>
                    )}
                </Box>
            </Box>

            {/* Right 80% (placeholder for now) */}
            <Box sx={{
                p: 2,
                width: '80%',
                overflowY: 'auto'
            }}>
                <Typography variant="h6">Sales Order Lines</Typography>

                {/* You can add long content here to test scrolling */}
                <Box sx={{ minHeight: '80vh', bgcolor: '#eee', mt: 2, borderRadius: '25px' }}>
                    <Table >
                        <TableHead>
                            <TableRow>
                                <TableCell>SKU</TableCell>
                                <TableCell>SKU Description</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Unit of Measure</TableCell>
                                <TableCell>Batch</TableCell>
                                <TableCell>Serial Number</TableCell>
                                <TableCell>SSCC Number</TableCell>
                                <TableCell>Remove</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ p: 1 }}>
                                        <Autocomplete
                                            options={skuList}
                                            value={row.sku}
                                            onChange={(_, value) => handleSkuChange(index, value || '')}
                                            renderInput={(params) => <TextField {...params} size="small" />}
                                            fullWidth
                                            sx={{ minWidth: 200 }}
                                        />
                                    </TableCell>

                                    <TableCell sx={{ p: 1 }}>
                                        <TextField
                                            value={row.skuDescription}
                                            size="small"
                                            disabled
                                            fullWidth
                                        />
                                    </TableCell>

                                    <TableCell sx={{ p: 1 }}>
                                        <TextField
                                            type="number"
                                            value={row.quantity}
                                            onChange={(e) => handleFieldChange(index, 'quantity', Number(e.target.value))}
                                            size="small"
                                            fullWidth
                                        />
                                    </TableCell>

                                    <TableCell sx={{ p: 1 }}>
                                        <Select
                                            value={row.unitOfMeasure}
                                            onChange={(e) => handleFieldChange(index, 'unitOfMeasure', e.target.value)}
                                            size="small"
                                            fullWidth
                                        >
                                            {row.options.unitOfMeasures.map((uom) => (
                                                <MenuItem key={uom} value={uom}>{uom}</MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>

                                    <TableCell sx={{ p: 1 }}>
                                        <Select
                                            value={row.batch}
                                            onChange={(e) => handleFieldChange(index, 'batch', e.target.value)}
                                            size="small"
                                            fullWidth
                                        >
                                            {row.options.batches.map((b) => (
                                                <MenuItem key={b} value={b}>{b}</MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>

                                    <TableCell sx={{ p: 1 }}>
                                        <Select
                                            value={row.serialNumber}
                                            onChange={(e) => handleFieldChange(index, 'serialNumber', e.target.value)}
                                            size="small"
                                            fullWidth
                                        >
                                            {row.options.serialNumbers.map((s) => (
                                                <MenuItem key={s} value={s}>{s}</MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>

                                    <TableCell sx={{ p: 1 }}>
                                        <Select
                                            value={row.ssccNumber}
                                            onChange={(e) => handleFieldChange(index, 'ssccNumber', e.target.value)}
                                            size="small"
                                            fullWidth
                                        >
                                            {row.options.ssccNumbers.map((s) => (
                                                <MenuItem key={s} value={s}>{s}</MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>

                                    <TableCell sx={{ p: 1 }}>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleRemoveRow(index)}
                                            disabled={!row.sku}
                                        >
                                            Remove
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Box sx={{ p: 1 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            sx={{ mb: 2 }}
                            loading={saving}
                        >
                            Submit Order
                        </Button></Box>

                </Box>
            </Box>
        </Box >
    );
};

export default SalesOrderPage;