import BackButton from "../components/BackButton"
import MapDisplay from "../components/MapDisplay"
import { GiFishingHook } from "react-icons/gi";

const Contact = () => {
  return (
    <>
    <div className="contactpage">
    <div class="contactbox"><h2 className="contactlogo">FIRST CATCH<GiFishingHook className="hook"/></h2> <br/> <address>51 Tupper St <br/>St.John's, NL <br/>A1A 2H6 <br/>Canada <br/>
                         FIRSTCATCH@email.com <br/>Ph.(709) 123-4567
                         </address></div>
    <div className="contactmap"> 
    <MapDisplay latitude={47.598719} longitude={-52.708148}/>
    </div>
    </div>
    

    <BackButton />
    </>
  )
}

export default Contact
