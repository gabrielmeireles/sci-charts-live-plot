import { SciChartSurface } from 'scichart';
import './App.css';
import LineChart from './components/LineChart';
import SciChartRealTime from './components/SciChartRealTime';

function App() {
  SciChartSurface.UseCommunityLicense();

  return (
    <main className="bg-gray-600 items-center flex flex-col min-h-screen justify-between p-8">
      <LineChart />
      <SciChartRealTime />
      <p className="this-is-me">Hope you like it</p>
    </main>
  );
}

export default App;
