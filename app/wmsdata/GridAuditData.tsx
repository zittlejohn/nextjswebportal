import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import { GridCellParams, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

type SparkLineData = number[];

function getDaysInMonth(month: number, year: number) {
    const date = new Date(year, month, 0);
    const monthName = date.toLocaleDateString('en-US', {
        month: 'short',
    });
    const daysInMonth = date.getDate();
    const days = [];
    let i = 1;
    while (days.length < daysInMonth) {
        days.push(`${monthName} ${i}`);
        i += 1;
    }
    return days;
}

function renderSparklineCell(params: GridCellParams<SparkLineData, any>) {
    const data = getDaysInMonth(4, 2024);
    const { value, colDef } = params;

    if (!value || value.length === 0) {
        return null;
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <SparkLineChart
                data={value}
                width={colDef.computedWidth || 100}
                height={32}
                plotType="bar"
                showHighlight
                showTooltip
                color="hsl(210, 98%, 42%)"
                xAxis={{
                    scaleType: 'band',
                    data,
                }}
            />
        </div>
    );
}

function renderStatus(status: 'Unreleased' | 'Released' | 'Completed') {
    const colors: { [index: string]: 'success' | 'error' | 'default' } = {
        'Completed': 'success',
        'Released': 'error',
        'Unreleased': 'default',
    };

    return <Chip label={status} color={colors[status]} size="small" />;
}

export function renderAvatar(params: GridCellParams<{ name: string; color: string }, any, any>) {
    if (params.value == null) {
        return '';
    }

    return (
        <Avatar
            sx={{
                backgroundColor: params.value.color,
                width: '24px',
                height: '24px',
                fontSize: '0.85rem',
            }}
        >
            {params.value.name.toUpperCase().substring(0, 1)}
        </Avatar>
    );
}

export const auditColumns: GridColDef[] = [
    { field: 'audit_timestamp', headerName: 'Date', headerAlign: 'left', align: 'left', flex: 1, minWidth: 100 },
    { field: 'audit_type', headerName: 'Audit Type', headerAlign: 'left', align: 'left', flex: 1, minWidth: 150 },
    { field: 'task', headerName: 'Task', headerAlign: 'left', align: 'left', flex: 1, minWidth: 70 },
    { field: 'from_site', headerName: 'Site', headerAlign: 'left', align: 'left', flex: 1, minWidth: 60 },
    { field: 'order_no', headerName: 'Order No', headerAlign: 'left', align: 'left', flex: 1, minWidth: 120 },
    { field: 'customer_ref', headerName: 'Customer Ref', headerAlign: 'left', align: 'left', flex: 1, minWidth: 150 },
    { field: 'sku', headerName: 'SKU', headerAlign: 'left', align: 'left', flex: 1, minWidth: 150 },
    { field: 'sku_description', headerName: 'SKU Description', headerAlign: 'left', align: 'left', flex: 1, minWidth: 150 },
    { field: 'quantity', headerName: 'Qty', headerAlign: 'left', align: 'left', flex: 1, minWidth: 50, type: 'number' },
    { field: 'uom', headerName: 'UOM', headerAlign: 'left', align: 'left', flex: 1, minWidth: 80 },
    { field: 'batch', headerName: 'Batch', headerAlign: 'left', align: 'left', flex: 1, minWidth: 100 },
    { field: 'date_expiry', headerName: 'Expiry Date', headerAlign: 'left', align: 'left', flex: 1, minWidth: 100 },
    { field: 'serial', headerName: 'Serial', headerAlign: 'left', align: 'left', flex: 1, minWidth: 100 },
    { field: 'sscc', headerName: 'SSCC', headerAlign: 'left', align: 'left', flex: 1, minWidth: 100 },
];
