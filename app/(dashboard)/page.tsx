import * as React from 'react';
import { PageContainer } from '@toolpad/core/PageContainer';
import DashboardContent from './DashboardContent';

export default function Dashboard() {
  return (
    <PageContainer sx={{ minWidth: '100%' }}>
      <DashboardContent />
    </PageContainer>
  );
}
