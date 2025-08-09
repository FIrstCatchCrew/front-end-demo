const ParallaxImage = ({ src, className, style }) => {
    return <img src={src} alt="" className={`parallax ${className}`} style={style} />;
  };
  
  export default ParallaxImage;
  