import { useCreation } from 'ahooks';
import type { EChartsReactProps } from 'echarts-for-react';
import { merge } from 'lodash-es';

import Echarts from '.';

export default (props: EChartsReactProps) => {
  const newProps = useCreation<EChartsReactProps>(
    () => ({
      ...props,
      ref: props?.option?.ref,
      option: merge(
        {
          tooltip: {
            trigger: 'item',
          },
          title: {
            x: 'center',
          },
          xAxis: { type: 'category' },
          yAxis: {},
          series: [{ type: 'bar' }],
        },
        props.option,
      ),
    }),
    [props],
  );

  return <Echarts {...newProps} />;
};
