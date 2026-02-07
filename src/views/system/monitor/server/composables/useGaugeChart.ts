import * as echarts from 'echarts';
import dayjs from 'dayjs';

export interface GaugeChartConfig {
  name: string;
}

export function createGaugeChart(el: HTMLElement, config: GaugeChartConfig): echarts.ECharts {
  const chart = echarts.init(el);
  const option = {
    tooltip: {
      formatter: '{a} <br/>{b} : {c}%',
    },
    series: [
      {
        type: 'gauge',
        name: config.name,
        radius: '90%',
        title: {
          show: true,
          fontSize: 12,
          color: 'green',
          offsetCenter: [-2, '30%'],
        },
        axisLine: {
          lineStyle: {
            show: true,
            with: 25,
            color: [
              [0.3, '#4dabf7'],
              [0.6, '#69db7c'],
              [0.8, '#ffa94d'],
              [1, '#ff6b6b'],
            ],
          },
        },
        axisTick: {
          distance: 0,
          length: 4,
          lineStyle: { color: 'auto', width: 1 },
        },
        axisLabel: {
          distance: 12,
          color: '#888',
          fontSize: 12,
        },
        splitLine: {
          length: 5,
          distance: 2,
          lineStyle: { width: 1, color: 'auto' },
        },
        splitNumber: 5,
        detail: {
          valueAnimation: true,
          formatter: '{value}%',
          textStyle: { fontSize: 20, color: 'red' },
          offsetCenter: ['0', '80%'],
        },
      },
    ],
  };
  chart.setOption(option);
  return chart;
}

export function setGaugeValue(chart: echarts.ECharts, value: number) {
  chart.setOption({
    series: [{ data: [{ value, name: '' }] }],
  });
}

export interface TimelineData {
  name: string[];
  value: number[];
}

export function createTimelineChart(el: HTMLElement, gradientColors: [string, string]): echarts.ECharts {
  const chart = echarts.init(el);
  const option = {
    tooltip: { trigger: 'axis' },
    grid: { top: 5, bottom: 5, left: 5, right: 30, containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, splitLine: { show: false } },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      axisLabel: { formatter: '{value}%' },
      splitLine: { show: false },
    },
    series: [
      {
        name: '使用率',
        type: 'line',
        showSymbol: false,
        data: [],
        smooth: true,
        lineStyle: { width: 0 },
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: gradientColors[0] },
            { offset: 1, color: gradientColors[1] },
          ]),
        },
      },
    ],
  };
  chart.setOption(option);
  return chart;
}

export function updateTimelineChart(chart: echarts.ECharts, data: TimelineData, value: number, maxPoints = 20) {
  data.name.push(dayjs().format('HH:mm:ss'));
  data.value.push(value);
  if (data.name.length > maxPoints) {
    data.name.shift();
    data.value.shift();
  }
  chart.setOption({
    xAxis: { data: data.name },
    series: [{ data: data.value }],
  });
}
