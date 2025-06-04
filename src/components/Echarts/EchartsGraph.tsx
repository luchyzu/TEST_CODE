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
          tooltip: {},
          animationDuration: 1500,
          animationEasingUpdate: 'quinticInOut',
          series: [
            {
              type: 'graph',
              layout: 'force',
              force: {
                gravity: 0.2, // 引力
                edgeLength: 200, // 默认距离
                repulsion: 800, // 斥力
              },
              roam: true,
              label: {
                position: 'right',
                formatter: '{b}',
              },
              lineStyle: {
                color: 'source',
                curveness: 0.3,
              },
              emphasis: {
                focus: 'adjacency',
                lineStyle: {
                  width: 10,
                },
              },
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
