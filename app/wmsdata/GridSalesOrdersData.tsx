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

// sales orders
export const salesOrderRows: GridRowsProp = [
    {
        id: 1,
        orderNumber: 'SO-55625',
        clientReference: 'G77654',
        orderStatus: 'Released',
        orderDate: '15/07/2025',
        customerName: 'Jeff Jeffordson',
        customerState: 'VIC',
        orderType: 'Standard',
        orderCompletedDate: '',
        totalUnits: '500',
        carrier: '',
        trackingNumber: '',
        trackingStatus: ''
    },
    {
        id: 2,
        orderNumber: 'SO-55626',
        clientReference: 'G77655',
        orderStatus: 'Released',
        orderDate: '16/07/2025',
        customerName: 'Sally McGregor',
        customerState: 'NSW',
        orderType: 'Express',
        orderCompletedDate: '',
        totalUnits: '120',
        carrier: '',
        trackingNumber: '',
        trackingStatus: ''
    },
    {
        id: 3,
        orderNumber: 'SO-55627',
        clientReference: 'G77656',
        orderStatus: 'Unreleased',
        orderDate: '17/07/2025',
        customerName: 'Raj Singh',
        customerState: 'QLD',
        orderType: 'Standard',
        orderCompletedDate: '',
        totalUnits: '75',
        carrier: '',
        trackingNumber: '',
        trackingStatus: ''
    },
    {
        id: 4,
        orderNumber: 'SO-55628',
        clientReference: 'G77657',
        orderStatus: 'Completed',
        orderDate: '14/07/2025',
        customerName: 'Maria Garcia',
        customerState: 'SA',
        orderType: 'Standard',
        orderCompletedDate: '15/07/2025',
        totalUnits: '200',
        carrier: 'Toll',
        trackingNumber: 'TLDEL900123',
        trackingStatus: 'Delivered'
    },
    {
        id: 5,
        orderNumber: 'SO-55629',
        clientReference: 'G77658',
        orderStatus: 'Unreleased',
        orderDate: '15/07/2025',
        customerName: 'Luke O’Brien',
        customerState: 'TAS',
        orderType: 'Click & Collect',
        orderCompletedDate: '',
        totalUnits: '40',
        carrier: '',
        trackingNumber: '',
        trackingStatus: ''
    },
    {
        id: 6,
        orderNumber: 'SO-55630',
        clientReference: 'G77659',
        orderStatus: 'Unreleased',
        orderDate: '13/07/2025',
        customerName: 'Chen Wei',
        customerState: 'WA',
        orderType: 'Backorder',
        orderCompletedDate: '',
        totalUnits: '600',
        carrier: '',
        trackingNumber: '',
        trackingStatus: ''
    },
    {
        id: 7,
        orderNumber: 'SO-55631',
        clientReference: 'G77660',
        orderStatus: 'Released',
        orderDate: '16/07/2025',
        customerName: 'Amelia Johnson',
        customerState: 'VIC',
        orderType: 'Standard',
        orderCompletedDate: '',
        totalUnits: '350',
        carrier: '',
        trackingNumber: '',
        trackingStatus: ''
    },
    {
        id: 8,
        orderNumber: 'SO-55632',
        clientReference: 'G77661',
        orderStatus: 'Completed',
        orderDate: '12/07/2025',
        customerName: 'George Lee',
        customerState: 'NT',
        orderType: 'Express',
        orderCompletedDate: '12/07/2025',
        totalUnits: '90',
        carrier: 'StarTrack',
        trackingNumber: 'STNT008800',
        trackingStatus: 'Delivered'
    },
    {
        id: 9,
        orderNumber: 'SO-55633',
        clientReference: 'G77662',
        orderStatus: 'Completed',
        orderDate: '10/07/2025',
        customerName: 'Sarah Ahmed',
        customerState: 'ACT',
        orderType: 'Standard',
        orderCompletedDate: '12/07/2025',
        totalUnits: '150',
        carrier: 'Australia Post',
        trackingNumber: 'APACT700001',
        trackingStatus: 'Delivered'
    },
    {
        id: 10,
        orderNumber: 'SO-55634',
        clientReference: 'G77663',
        orderStatus: 'Unreleased',
        orderDate: '14/07/2025',
        customerName: 'Nick Wilson',
        customerState: 'NSW',
        orderType: 'Standard',
        orderCompletedDate: '',
        totalUnits: '0',
        carrier: '',
        trackingNumber: '',
        trackingStatus: ''
    }
];

export const salesOrderColumns: GridColDef[] = [
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
        field: 'customerName',
        headerName: 'Customer',
        headerAlign: 'left',
        align: 'left',
        flex: 1,
        minWidth: 200,
    },
    {
        field: 'customerState',
        headerName: 'State',
        headerAlign: 'left',
        align: 'left',
        flex: 1,
        minWidth: 100,
    },
    {
        field: 'orderType',
        headerName: 'Order Type',
        headerAlign: 'left',
        align: 'left',
        flex: 1,
        minWidth: 100,
    },
    // {
    //     field: 'totalUnits',
    //     headerName: 'Total Units',
    //     headerAlign: 'left',
    //     align: 'left',
    //     flex: 1,
    //     minWidth: 80,
    // },
    {
        field: 'orderCompletedDate',
        headerName: 'Completed Date',
        headerAlign: 'left',
        align: 'left',
        flex: 1,
        minWidth: 80,
    },
    {
        field: 'carrier',
        headerName: 'Carrier',
        headerAlign: 'left',
        align: 'left',
        flex: 1,
        minWidth: 70,
    },
    {
        field: 'units',
        headerName: 'Units',
        headerAlign: 'left',
        align: 'left',
        flex: 1,
        minWidth: 40,
    },
    {
        field: 'lines',
        headerName: 'Lines',
        headerAlign: 'left',
        align: 'left',
        flex: 1,
        minWidth: 40,
    },
    {
        field: 'skus',
        headerName: 'Skus',
        headerAlign: 'left',
        align: 'left',
        flex: 1,
        minWidth: 40,
    },
    {
        field: 'trackingNumber',
        headerName: 'Tracking Number',
        headerAlign: 'left',
        align: 'left',
        flex: 1,
        minWidth: 80,
    },
    {
        field: 'trackingStatus',
        headerName: 'Tracking Status (if available)',
        headerAlign: 'left',
        align: 'left',
        flex: 1,
        minWidth: 80,
    },
    // {
    //     field: 'dailyOrders',
    //     headerName: 'Daily Orders',
    //     flex: 1,
    //     minWidth: 150,
    //     renderCell: renderSparklineCell,
    // },
];
