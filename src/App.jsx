import { Routes, Route } from 'react-router-dom';

// pages
import PageNotFound from './pages/page-not-found/PageNotFound';
import Home from './pages/home/Home';
import AvailableCatches from './pages/available-catches/AvailableCatches';
import NewCatch from './pages/new-catch/NewCatch';
import ServiceTest from './pages/service-test/ServiceTest';

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
          <Route path="/service-test" element={<ServiceTest />} />
          <Route path="/new-catch" element={<NewCatch />} />
          <Route path="/available-catches" element={<AvailableCatches />} />
          <Route path="/available-catches/:filtertype/:filterValue" element={<AvailableCatches />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
      <FooterBar />
    </div>
    </>
  );
}

export default App;
