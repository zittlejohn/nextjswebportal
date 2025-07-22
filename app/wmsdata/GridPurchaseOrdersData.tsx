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

export const purchaseOrderColumns: GridColDef[] = [
    {
        field: 'site',
        headerName: 'Site',
        headerAlign: 'left',
        align: 'left',
        flex: 1,
        minWidth: 50,
    },
    {
        field: 'orderDate',
        headerName: 'Order Date',
        headerAlign: 'left',
        align: 'left',
        flex: 1,
        minWidth: 80,
    },
    {
        field: 'orderNumber',
        headerName: 'Order Number',
        headerAlign: 'left',
        align: 'left',
        flex: 1,
        minWidth: 100,
    },
    {
        field: 'clientReference',
        headerName: 'Client Reference',
        headerAlign: 'left',
        align: 'left',
        flex: 1,
        minWidth: 100,
    },
    {
        field: 'orderStatus',
        headerName: 'WMS Status',
        headerAlign: 'left',
        align: 'left',
        flex: 1,
        minWidth: 110,
        renderCell: (params) => renderStatus(params.value as any),
    },
    {
        field: 'orderType',
        headerName: 'Order Type',
        headerAlign: 'left',
        align: 'left',
        flex: 1,
        minWidth: 100,
    },
    {
        field: 'orderCompletedDate',
        headerName: 'Completed Date',
        headerAlign: 'left',
        align: 'left',
        flex: 1,
        minWidth: 80,
    },
    {
        field: 'lines',
        headerName: 'Lines',
        headerAlign: 'left',
        align: 'left',
        flex: 1,
        minWidth: 70,
    },
    {
        field: 'skus',
        headerName: 'Skus',
        headerAlign: 'left',
        align: 'left',
        flex: 1,
        minWidth: 70,
    },
    {
        field: 'items',
        headerName: 'Items',
        headerAlign: 'left',
        align: 'left',
        flex: 1,
        minWidth: 70,
    },
    // {
    //     field: 'dailyOrders',
    //     headerName: 'Daily Orders',
    //     flex: 1,
    //     minWidth: 150,
    //     renderCell: renderSparklineCell,
    // },
];
