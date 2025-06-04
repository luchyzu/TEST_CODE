import type { EChartsReactProps } from 'echarts-for-react';

import Echarts from '.';
import { useCreation } from 'ahooks';
import { merge } from 'lodash-es';

export default (props: EChartsReactProps) => {
  const newProps = useCreation<EChartsReactProps>(
    () => ({
      ...props,
      option: merge(
        {
          tooltip: {
            trigger: 'item',
            formatter: '{b}',
          },
          series: [
            {
              type: 'tree',
              name: '自然资源厅',
              edgeShape: 'polyline', // 链接线是折现还是曲线

              top: '1%',
              left: '5%',
              symbolSize: 40,
              symbol: 'image',
              initialTreeDepth: 10,
              leaves: {
                label: {
                  position: 'right',
                  verticalAlign: 'middle',
                  align: 'left',
                },
              },
              label: {
                position: 'bottom',
                verticalAlign: 'middle',
                align: 'center',
                fontSize: 9,
                normal: {
                  position: 'center',
                  verticalAlign: 'middle',
                  align: 'left',
                  backgroundColor: '#99d97c',
                  color: '#fff',
                  padding: 3,
                  formatter: ['{box|{b}}'].join('\n'),
                  rich: {
                    box: {
                      height: 30,
                      color: '#fff',
                      padding: [0, 5],
                      align: 'center',
                    },
                  },
                },
              },
              expandAndCollapse: true,
              animationDuration: 550,
              animationDurationUpdate: 750,
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
