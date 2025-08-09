
import { useState, useEffect } from 'react';
import ParallaxImage from './ParallaxImage';
import Box from './Box';
import {Link} from "react-router-dom"

const MainBody = () => {
  const [boatPosition, setBoatPosition] = useState(false);
  const [wharfPosition, setWharfPosition] = useState({ left: '100%' });
  const [fishTransform, setFishTransform] = useState('');
  const [fishDirection, setFishDirection] = useState(1); 
  const [lastMouseX, setLastMouseX] = useState(0);
  


  useEffect(() => {
    const handleMouseMove = (e) => {
      const boundary = document.querySelector('.fish-boundary').getBoundingClientRect();
  
      const xValue = Math.min(
        Math.max(e.clientX - window.innerWidth / 2, boundary.left - boundary.width),
        boundary.right - boundary.width / 2
      );
      const yValue = Math.min(Math.max(e.clientY - boundary.top, 60), boundary.height);
  
      const direction = e.clientX > lastMouseX ? -1 : 1;
      const rotationAngle = Math.sin(Date.now() / 80) * 12;
  
      setFishDirection(direction); 
      setLastMouseX(e.clientX); 
  
     console.log(yValue)
      setFishTransform(
        `translateX(calc(-50% + ${xValue * -1.6}px)) 
         translateY(calc(50% + ${yValue * -1.1}px)) 
         rotate(${rotationAngle}deg) 
         scaleX(${fishDirection})
         scale(${1.4 -(.003* yValue)})`
      );
    };
  
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [lastMouseX]);
  
  



  return (
    <main>
      <img src="src/assets/images/sun.png" alt="sun" className='sun'/>
      <ParallaxImage
        src="src/assets/images/waves_layer1.png"
        className="waves_layer1"
      />
      <ParallaxImage
        src="src/assets/images/waves_layer2.png"
        className="waves_layer2"
      />
      <ParallaxImage
        src="src/assets/images/waves_layer3.png"
        className="waves_layer3"
      />
      <div className="fish-boundary">
      <img
      src="src/assets/images/fish.png"
      className="fish"
      style={{ transform: fishTransform }}
      alt="fish"
      />
      </div>
      <Box
        className="boxleft"
        onHover={() => setBoatPosition(true)}
        onLeave={() => setBoatPosition(false)}
      >
        <Link to="/catch">SELL FISH HERE</Link> 
      </Box>
      <Box
        className="boxright"
        onHover={() => setWharfPosition({ left: '35%' })}
        onLeave={() => setWharfPosition({ left: '80%' })}
      >
        <Link to="/menu">BUY FISH HERE</Link> 
      </Box>
      <img
        src="/src/assets/images/boat.png"
        className="boat"
        style={{ left: boatPosition ? '-15%' : '-100%' }}
      />
      <img
        src="/src/assets/images/wharf.png"
        className="wharf"
        style={wharfPosition}
      />
    </main>
  );
};

export default MainBody;
