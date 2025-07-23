import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';

export default function HighlightedCard() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  return (
    <Card sx={{ height: '100%' }} variant="outlined">
      <CardContent>
        {/* <InsightsRoundedIcon /> */}
        <Typography component="h2" variant="subtitle2" gutterBottom sx={{ fontWeight: '600' }}>
          Create a New Sales Order
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: '8px' }}>
          With our new and improved User Interface for our online portal, users will experience faster performance, easier navigation, and a more streamlined experience overall.
        </Typography>
        <Button
          variant="contained"
          size="small"
          color="primary"
          // endIcon={<ChevronRightRoundedIcon />}
          fullWidth={isSmallScreen}
          onClick={() => router.push(`/salesorders/create`)}
        >
          Create Sales Order
        </Button>
      </CardContent>
    </Card>
  );
}
