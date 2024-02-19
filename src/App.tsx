import './App.css';
import { MapChart } from './tools/MapChart';
import spinner from "./data/img/spinner.svg";

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
      <div className="container p-3 mx-auto">
        <MapChart />
      </div>
      <div id='loader' className='fixed w-full h-full flex items-center justify-center backdrop-blur-sm top-0 left-0'>
        <div className='w-[30px] h-[30px]'>
          <img src={spinner} className="w-full h-full" />
          </div>
        <span className='ms-2'>Loading...</span>
      </div>
    </>
  );
}

export default App;
