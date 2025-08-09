import { Routes, Route } from 'react-router-dom';

// pages
import PageNotFound from './pages/page-not-found/PageNotFound';
import Home from './pages/home/Home';
import AvailableCatches from './pages/available-catches/AvailableCatches';

// components
import NavigationBar from './components/navigation-bar/NavigationBar';
import FooterBar from './components/Footer-bar/FooterBar';

import './App.css';

function App() {
  return (
    <>
    <div className='app-container'>
      <NavigationBar />
      <div className="content-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/available-catches" element={<AvailableCatches />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
      <FooterBar />
    </div>
    </>
  );
}

export default App;
