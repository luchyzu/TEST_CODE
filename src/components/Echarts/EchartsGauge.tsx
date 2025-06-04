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
          series: [
            {
              type: 'gauge',
              center: ['50%', '88%'],
              startAngle: 190,
              endAngle: -10,
              radius: '125%',
              progress: {
                show: true,
                width: 30,
              },
              pointer: {
                show: false,
              },
              axisLine: {
                lineStyle: {
                  width: -10,
                  color: [
                    [0.7, '#7CFFB2'],
                    [0.9, '#FDDD60'],
                    [1, '#FF6E76'],
                  ],
                },
              },
              axisTick: {
                show: false,
              },
              splitLine: {
                show: false,
              },
              axisLabel: {
                show: false,
              },
              detail: {
                valueAnimation: true,
                width: '50%',
                lineHeight: 40,
                borderRadius: 8,
                offsetCenter: [0, '-12%'],
                fontSize: 40,
                fontWeight: 'bolder',
                formatter: '{value} %',
                color: 'inherit',
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
