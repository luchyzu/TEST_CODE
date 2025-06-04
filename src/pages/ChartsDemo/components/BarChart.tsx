import EchartsBar from '@/components/Echarts/EchartsBar';

export default (props: { data: { xAxis: string[]; series: any, ref: any } }) => {
  const { xAxis, series, ref } = props.data;
  console.log(props,'1123')
  return (
    <EchartsBar
      option={{
        legend: {
          top: 0,
          left: 'center',
        },
        xAxis: {
          type: 'category',
          data: xAxis,
        },
        series: series,
        ref: ref,
      }}
    />
  );
};
