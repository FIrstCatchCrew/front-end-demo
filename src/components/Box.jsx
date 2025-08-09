import { useState} from "react";


const Box = ({className, children, onHover, onLeave}) => {
    const [hover, setHover] = useState(false);

    const handleMouseOver = () => {
        setHover(true);
        onHover && onHover();
    };
    
    const handleMouseLeave = () => {
        setHover(false);
        onHover && onLeave();
    };


  return (
    <div className={className} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
        {children}
    </div>
  )
}

export default Box;
