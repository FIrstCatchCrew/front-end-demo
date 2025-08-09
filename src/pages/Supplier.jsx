import { LuConstruction } from "react-icons/lu";
import BackButton from "../components/BackButton";


const Supplier = () => {
  return (
    <>
    <div className="infobox"> 
    <h1 className="infoheader"><LuConstruction className="constructicon"/>UNDER CONSTRUCTION
        <LuConstruction className="constructicon"/></h1>
        <div className="infotext">
        <p>This will be the future site of the registration page for fishers. This will store all fishers data in a local server. 
             This will allow for a login page that will automatically process catch entries under the relevent account and keep 
             a history of sale, another server which will receive DELETEd entries from the menu. Other future functions to be added:
              </p>
              <br/>
              <ul>
                <li>Registration for customers, similiar login and account history functionality as for fishers</li>
                <li>Financial transaction capability</li>
                <li>Mobile expansion, integration of geolocation services.</li>
                <li>Hybrid blockchain functionality to tokenize geo/time data into unique fingerprint</li>
                <li>And so much more...</li>
              </ul>
        </div>
    </div>
    <BackButton />
    
    </>
  )
  
}

export default Supplier
