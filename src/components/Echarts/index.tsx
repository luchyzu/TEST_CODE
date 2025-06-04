import { PageLoading } from '@ant-design/pro-layout';
import type { EChartsReactProps } from 'echarts-for-react';
import { lazy, Suspense } from 'react';

const EchartsBase = lazy(() => import('./EchartsBase'));

export default (props: EChartsReactProps) => (
  <Suspense fallback={<PageLoading />}>
    <EchartsBase {...props} />
  </Suspense>
);
