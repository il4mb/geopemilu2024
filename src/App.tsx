import './App.css';
import { MapChart } from './tools/MapChart';

function App() {
  return (
    <>
      <nav className='px-3'>
        <div className='flex'>
          <h1 className='text-3xl font-bold text-blue-400 py-3'>Geo Pemilu 2024</h1>
          <div className='ms-auto'>
            <p className='p-3'>Create with ❤️ by <a href='https://github.com/il4mb' target='_blank' className='text-blue-500'>il4mb</a></p>
          </div>
        </div>
      </nav>
      <div className="container p-3">

        <MapChart />
      </div></>
  );
}

export default App;
