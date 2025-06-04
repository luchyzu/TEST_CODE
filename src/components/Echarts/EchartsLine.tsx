import { useCreation } from 'ahooks';
import type { EChartsReactProps } from 'echarts-for-react';
import { merge } from 'lodash-es';

import Echarts from '.';

export default (props: EChartsReactProps) => {
  const newProps = useCreation<EChartsReactProps>(
    () => ({
      ...props,
      option: merge(
        {
          title: {
            x: 'center',
          },
          tooltip: {
            trigger: 'item',
          },
          xAxis: {
            data: [],
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              type: 'line',
              data: [],
            },
          ],
        },
        props.option,
      ),
    }),
    [props],
  );

  return <Echarts {...newProps} />;
};
