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
          series: [
            {
              type: 'pie',
              labelLine: {
                length: 30,
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
