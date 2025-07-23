import * as React from 'react';
import { NextAppProvider } from '@toolpad/core/nextjs';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import HubIcon from '@mui/icons-material/Hub';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import type { Navigation } from '@toolpad/core/AppProvider';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { SessionProvider, signIn, signOut } from 'next-auth/react';
import theme from '../theme';
import { auth } from '../auth';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'stock',
    title: 'Stock',
    icon: <Inventory2Icon />,
  },
  {
    segment: 'salesorders',
    title: 'Sales Orders',
    icon: <ReceiptLongIcon />,
  },
  {
    segment: 'purchaseorders',
    title: 'Purchase Orders',
    icon: <ShoppingBagIcon />,
  },
  {
    segment: 'products',
    title: 'Products',
    icon: <CategoryIcon />,
  },
  {
    segment: 'customers',
    title: 'Customers',
    icon: <PeopleIcon />,
  },
  {
    segment: 'suppliers',
    title: 'Suppliers',
    icon: <LocalShippingIcon />,
  },
  {
    segment: 'audit',
    title: 'Audit',
    icon: <FactCheckIcon />,
  },
  {
    segment: 'integrations',
    title: 'Integrations',
    icon: <HubIcon />,
  },
  // {
  //   segment: 'employees',
  //   title: 'Employees',
  //   icon: <PeopleIcon />,
  //   pattern: 'employees{/:employeeId}*',
  // },
];

const AUTHENTICATION = {
  signIn,
  signOut,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  return (
    <html lang="en" data-toolpad-color-scheme="light">
      <body>
        <SessionProvider session={session}>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <NextAppProvider
              theme={theme}
              navigation={NAVIGATION}
              branding={{
                logo: <img src="https://flsa.com.au/wp-content/uploads/2022/04/FLSA-Logo-Cut.png" alt="FLSA logo" width={150} />,
                title: 'Cypher WMS Web Portal',
                homeUrl: '/',
              }}
              session={session}
              authentication={AUTHENTICATION}
            >
              {children}
            </NextAppProvider>
          </AppRouterCacheProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
