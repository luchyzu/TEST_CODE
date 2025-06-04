import type { EChartsReactProps } from 'echarts-for-react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import {
  BarChart,
  // TreemapChart,
  GraphChart,
  LineChart,
  PieChart,
  // ScatterChart,
  // RadarChart,
  // MapChart,
  TreeChart,
  GaugeChart,
} from 'echarts/charts';
import {
  // LegendScrollComponent,
  // LegendPlainComponent,
  DataZoomComponent,
  // GridSimpleComponent,
  GridComponent,
  // TimelineComponent,
  // MarkPointComponent,
  // MarkLineComponent,
  // MarkAreaComponent,
  LegendComponent,
  // AxisPointerComponent,
  // BrushComponent,
  TitleComponent,
  // PolarComponent,
  // RadarComponent,
  // GeoComponent,
  // SingleAxisComponent,
  // ParallelComponent,
  // CalendarComponent,
  // GraphicComponent,
  ToolboxComponent,
  TooltipComponent,
} from 'echarts/components';
// import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import * as echarts from 'echarts';
import { useRef } from 'react';
import { useCreation } from 'ahooks';

export default (props: EChartsReactProps) => {
  const chartsref = useRef<any>();
  const right1 = useRef<any>();

  echarts.use([
    CanvasRenderer,

    TitleComponent,
    TooltipComponent,
    ToolboxComponent,
    GridComponent,
    DataZoomComponent,
    LegendComponent,

    BarChart,
    TreeChart,
    PieChart,
    GraphChart,
    LineChart,
    GaugeChart,
  ]);
  console.log(props, 123)
  useCreation(() => {
    setTimeout(() => {
      let myChart = props.option.ref && props.option.ref.current.getEchartsInstance();
      document.oncontextmenu = function () {
        return false;
      }

      myChart.on('contextmenu', (e) => {
        console.log(e, 'eeeeeeee', right1, e.event.offsetX)
        right1.current.style.display = 'flex';
        right1.current.style.left = `${e.event.event.clientX}px`;
        right1.current.style.top = `${e.event.event.clientY}px`;
        right1.current.style.position = `fixed`;
      })
      myChart.on('mouseover', () => {
        right1.current.style.display = 'none';
      })
    }, 10)

  }, [props])
  return (
    <>
      <ReactEChartsCore
        {...props}
        echarts={echarts}
        ref={props.option.ref}
        // notMerge={true}
        lazyUpdate={true}
        // theme={props.theme ?? THEME ?? 'light'}
        style={{ height: 400, width: '100%', ...props.style }}
      />
      <div onClick={() => {
        let myChart = props.option.ref && props.option.ref.current.getEchartsInstance();
        myChart.resize()
        myChart.on('click', (e) => {
          console.log(e, 'eeeeeeee')
        })
        console.log(myChart, 'myChart')
        let index = 0
        let timer = setInterval(() => {
          console.log(123)
          // 获取最大游标，用于重置定时器初始值
          // dataZoom
          myChart.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: index,
            position: [30, 20]
          })

          index++; // 下标自增

          // 重置下标
          if (index > 1) { index = 0 }

        }, 2000)



      }}>11111111111</div>
      <div ref={right1} style={{width: 200, height: 200, background:"#000"}} onMouseLeave={()=> {
        right1.current.style.display = 'none';
      }}>
        123
      </div>
    </>
  );
};
