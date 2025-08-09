import Header from './components/Header.jsx'
import MainBody from './components/MainBody.jsx'
import ParallaxImage from "./components/ParallaxImage"
import MenuItem from './pages/MenuItem.jsx';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css'
import Contact from "./pages/Contact";
import Supplier from "./pages/Supplier";
import Story from "./pages/Story";
import Menu from "./pages/Menu";
import Catch from "./pages/Catch";


function App() {

  return (
  <Router>
  <Header />
  
  <Routes>
    <Route path="*" element={<MainBody />} />
    <Route path="/mainbody" element={<MainBody />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/supplier" element={<Supplier />} />
    <Route path="/story" element={<Story />} />
    <Route path="/menu" element={<Menu />} />
    <Route path="/catch" element={<Catch />} />
    <Route path="/menu/:id"element={<MenuItem />} />
  </Routes>
  <ParallaxImage
    src="src/assets/images/waves_layer3.png"
    className="waves_layer3"/>
  </Router>
    )
}

export default App
