import { GiFishingHook } from "react-icons/gi";
import {Link} from "react-router-dom";




const Header = () => {
  return (
    
    <header>
        <nav>
            <Link to="/"><div className="logo">
                FIRST CATCH<GiFishingHook className="hook"/>
                </div></Link>
            <div className="notlogo">
                <ul>
                    <li>
                       <Link to="/story"> Our Story</Link>
                    </li>
                    <li>
                      <Link to="/supplier">Info & Registration</Link> 
                    </li>
                    <li>
                        <Link to="/contact">Contact</Link>
                    </li>
                </ul>
               
                
            </div>

        </nav>
    </header>
    
  )
}

export default Header
