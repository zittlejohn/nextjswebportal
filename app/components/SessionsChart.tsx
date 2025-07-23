import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

function getLast30Days(): string[] {
  const days: string[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const formatted = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    days.push(formatted); // e.g., 'Jul 22'
  }

  return days;
}

interface SessionsChartProps {
  stats?: any;
}

export default function SessionsChart({
  stats,
}: SessionsChartProps) {
  const theme = useTheme();
  const data = getLast30Days();

  const colorPalette = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
  ];

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        {stats &&
          <>
            <Typography component="h2" variant="subtitle2" gutterBottom>
              Sales Orders vs Purchase Orders
            </Typography>
            <Stack sx={{ justifyContent: 'space-between' }}>
              <Stack
                direction="row"
                sx={{
                  alignContent: { xs: 'center', sm: 'flex-start' },
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Typography variant="h4" component="p">
                  {stats.statCards[0].value} vs {stats.statCards[1].value}
                </Typography>
                {/* <Chip size="small" color="success" label="+35%" /> */}
              </Stack>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Trends of Sales and Purchase Orders
              </Typography>
            </Stack>
            <LineChart
              colors={colorPalette}
              xAxis={[
                {
                  scaleType: 'point',
                  data,
                  tickInterval: (index, i) => (i + 1) % 5 === 0,
                },
              ]}
              series={[
                {
                  id: 'direct',
                  label: 'Sales Orders',
                  showMark: false,
                  curve: 'linear',
                  stack: 'total',
                  area: true,
                  stackOrder: 'ascending',
                  data: stats.statCards[0].data
                },
                {
                  id: 'referral',
                  label: 'Purchase Orders',
                  showMark: false,
                  curve: 'linear',
                  stack: 'total',
                  area: true,
                  stackOrder: 'ascending',
                  data: stats.statCards[1].data,
                }
              ]}
              height={250}
              margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
              grid={{ horizontal: true }}
              sx={{
                '& .MuiAreaElement-series-organic': {
                  fill: "url('#organic')",
                },
                '& .MuiAreaElement-series-referral': {
                  fill: "url('#referral')",
                },
                '& .MuiAreaElement-series-direct': {
                  fill: "url('#direct')",
                },
              }}
              hideLegend
            >
              <AreaGradient color={theme.palette.primary.dark} id="organic" />
              <AreaGradient color={theme.palette.primary.main} id="referral" />
              <AreaGradient color={theme.palette.primary.light} id="direct" />
            </LineChart>
          </>}
      </CardContent>
    </Card>
  );
}
