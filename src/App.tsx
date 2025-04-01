import { SciChartSurface } from 'scichart';
import './App.css';
import LineChart from './components/LineChart';
import SciChartRealTime from './components/SciChartRealTime';

function App() {
  SciChartSurface.UseCommunityLicense();

  return (
    <>
      <div className="card">
        <LineChart />
      </div>
      <div className="card">
        <SciChartRealTime />
      </div>
      <p className="this-is-me">Hope you like it</p>
    </>
  );
}

export default App;
