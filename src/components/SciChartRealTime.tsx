import { useEffect, useRef, useState } from 'react';
import {
  SciChartSurface,
  FastLineRenderableSeries,
  XyDataSeries,
  TSurfaceDefinition,
  EThemeProviderType,
  EChart2DModifierType,
  ESciChartSurfaceType,
  EAxisType,
} from 'scichart';
import { SciChartReact } from 'scichart-react';

const SERIES_COLORS: string[] = ['#FF6600', '#00AAFF', '#AA00FF', '#FFAA00', '#00FFAA'];
const MAX_AMOUNT_DATASETS = SERIES_COLORS.length;
const INITIAL_DATASETS_AMOUNT = 0;
const CHART_UPDATE_RATE_MS = 50;

const SciChartRealTime = () => {
  const [amountDatasets, setAmountDatasets] = useState<number>(INITIAL_DATASETS_AMOUNT);
  const [chart, setChart] = useState<SciChartSurface | null>(null!);
  const datasets = useRef<XyDataSeries[]>([]);

  const chartConfig: TSurfaceDefinition = {
    type: ESciChartSurfaceType.Default2D,
    options: {
      surface: {
        theme: { type: EThemeProviderType.Dark },
        title: 'Real Time Chart',
        titleStyle: {
          fontSize: 20,
        },
      },
      modifiers: [
        { type: EChart2DModifierType.MouseWheelZoom },
        {
          type: EChart2DModifierType.ZoomPan,
          options: { enableZoom: true },
        },
        { type: EChart2DModifierType.ZoomExtents },
      ],
      yAxes: {
        type: EAxisType.NumericAxis,
      },
      xAxes: {
        type: EAxisType.NumericAxis,
      },
      onCreated: async (sciChartSurface: SciChartSurface) => {
        setChart(sciChartSurface);
      },
    },
  };

  useEffect(() => {
    const intervalRef = setInterval(() => {
      onAddSeriesData();
    }, CHART_UPDATE_RATE_MS);
    return () => clearInterval(intervalRef);
  }, [chart]);

  const onClearSeries = () => {
    console.log('clearSeries');

    if (!chart) return;

    setAmountDatasets(0);
    chart.renderableSeries.clear();
    datasets.current = [];
  };

  const onAddSeriesData = () => {
    console.log('onAddSeriesData');

    if (!chart) return;

    const now = Date.now();
    datasets.current.forEach((dataset, idx) => {
      dataset.append(now, Math.sin(now / 1000) + idx);
      if (dataset.count() > 2000) dataset.removeRange(0, 10);
    });

    chart.invalidateElement();
    chart.zoomExtents();
  };

  const onSetAmountDatasets = (amount: number) => {
    const newAmount = Math.min(Math.max(1, amount), MAX_AMOUNT_DATASETS);
    if (newAmount === amountDatasets) return;

    console.log(`Updating datasets amount from ${amountDatasets} to ${newAmount}`);

    onUpdateDatasetsAmount(amountDatasets, newAmount);
    setAmountDatasets(newAmount);
  };

  const onUpdateDatasetsAmount = (oldAmount: number, newAmount: number) => {
    const increased = newAmount > oldAmount;

    if (increased) {
      const indexesToCreate = new Array(newAmount - oldAmount)
        .fill(0)
        .map((_, idx) => idx + oldAmount);
      indexesToCreate.forEach(createDataSeries);
      return;
    }

    const indexesToRemove = new Array(oldAmount - newAmount)
      .fill(0)
      .map((_, idx) => idx + newAmount);
    indexesToRemove.forEach(removeDataSeries);
  };

  const createDataSeries = (index: number) => {
    if (!chart) return;

    const dataSeries = new XyDataSeries(chart.webAssemblyContext2D, {
      dataSeriesName: `Dataset ${index}`,
    });
    const lineSeries = new FastLineRenderableSeries(chart.webAssemblyContext2D, {
      dataSeries,
      stroke: SERIES_COLORS[index % SERIES_COLORS.length],
    });
    chart.renderableSeries.add(lineSeries);
    datasets.current.push(dataSeries);
  };

  const removeDataSeries = (index: number) => {
    if (!chart) return;

    chart.renderableSeries.removeAt(index);
    datasets.current.splice(index, 1);
  };

  return (
    <div className="flex flex-col gap-2">
      <SciChartReact style={{ width: 600, height: 400 }} config={chartConfig} />
      <div className="gap-2 flex justify-center">
        <button onClick={() => onClearSeries()}>Clear Data</button>
        <button onClick={() => onSetAmountDatasets(amountDatasets - 1)}>-</button>
        <button onClick={() => onSetAmountDatasets(amountDatasets + 1)}>+</button>
      </div>
    </div>
  );
};

export default SciChartRealTime;
