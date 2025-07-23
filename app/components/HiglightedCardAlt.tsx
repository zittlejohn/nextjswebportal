'use client';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';

export default function HighlightedCardAlt() {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const router = useRouter();

    return (
        <Card sx={{ height: '100%' }} variant="outlined">
            <CardContent>
                {/* <InsightsRoundedIcon /> */}
                <Typography component="h2" variant="subtitle2" gutterBottom sx={{ fontWeight: '600' }}>
                    Create a New Purchase Order
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: '8px' }}>
                    With our new and improved Purchase Order system, users can create, track, and manage orders more efficiently with a cleaner layout and faster performance.
                </Typography>
                <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    // endIcon={<ChevronRightRoundedIcon />}
                    fullWidth={isSmallScreen}
                    onClick={() => router.push(`/purchaseorders/create`)}
                >
                    Create Purchase Order
                </Button>
            </CardContent>
        </Card>
    );
}
