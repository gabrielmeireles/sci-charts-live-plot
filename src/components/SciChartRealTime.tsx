import { useEffect, useRef, useState } from 'react';
import { SciChartSurface, NumericAxis, FastLineRenderableSeries, XyDataSeries } from 'scichart';

const SERIES_COLORS: string[] = ['#FF6600', '#00AAFF', '#AA00FF', '#FFAA00', '#00FFAA'];

const SciChartRealTime = () => {
  const [numSeries, setNumSeries] = useState<number>(1);
  const [chart, setChart] = useState<SciChartSurface | null>(null);
  const seriesRef = useRef<XyDataSeries[]>([]);
  const intervalRef = useRef<any>(null);

  const getWasmContext = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create('chart-container');
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    setChart(sciChartSurface);

    return wasmContext;
  };

  useEffect(() => {
    getWasmContext();
    return () => chart?.delete();
  }, []);

  useEffect(() => {
    if (!chart) return;
    chart.renderableSeries.clear();
    seriesRef.current = [];

    for (let i = 0; i < numSeries; i++) {
      const dataSeries = new XyDataSeries(chart.webAssemblyContext2D);
      const lineSeries = new FastLineRenderableSeries(chart.webAssemblyContext2D, {
        dataSeries,
        stroke: SERIES_COLORS[i % SERIES_COLORS.length],
      });
      chart.renderableSeries.add(lineSeries);
      seriesRef.current.push(dataSeries);
    }
  }, [numSeries, chart]);

  useEffect(() => {
    if (!chart) return;
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      seriesRef.current.forEach((series) => {
        series.append(now, Math.random() * 2 - 1);
        if (series.count() > 2000) series.removeRange(0, 10);
      });
    }, 50);
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [chart]);

  return (
    <div>
      <div id="chart-container" style={{ width: '600px', height: '400px' }}></div>
      <button onClick={() => seriesRef.current.forEach((s) => s.clear())}>Clear Data</button>
      <button onClick={() => setNumSeries((prev) => Math.max(1, prev - 1))}>-</button>
      <button onClick={() => setNumSeries((prev) => prev + 1)}>+</button>
    </div>
  );
};

export default SciChartRealTime;
