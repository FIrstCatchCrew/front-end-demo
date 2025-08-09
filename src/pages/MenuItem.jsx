import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import MapDisplay from "../components/MapDisplay";

const MenuItem = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [weight, setWeight] = useState(""); 
  const [totalCost, setTotalCost] = useState(0);
  const [successMessage, setSuccessMessage] = useState(""); 
  
  useEffect(() => {
    fetch(`http://localhost:5000/menuitems/${id}`)
      .then((res) => res.json())
      .then((data) => setItem(data))
      .catch((err) => console.error("Failed to fetch item:", err));
  }, [id]);


  useEffect(() => {
    if (item && weight) {
      setTotalCost(weight * item.pricePerLb);
    }
  }, [weight, item]);

  const handlePurchase = () => {
    fetch(`http://localhost:5000/menuitems/${id}`, { method: "DELETE" })
      .then(() => {
        setSuccessMessage("Purchase successful!");
        setTimeout(() => navigate("/menu"), 1500);
      })
      .catch((err) => console.error("Failed to delete item:", err));
  };

  if (!item) return <p>Loading item details...</p>;

  const googleMapsUrl = item.location;

    const convertToOSMUrl = (googleUrl) => {
        const regex = /@?(-?\d+\.\d+),(-?\d+\.\d+)/;
        const match = googleUrl.match(regex);

        if (match) {
            const lat = match[1];
            const lon = match[2];
            console.log(lat)
            console.log(lon)
            return [lat,lon];
            
        }
        };

const osmUrl = convertToOSMUrl(googleMapsUrl);
console.log(osmUrl);
const timeRecord =item.timeOfCatch.replace(/(@|T)/, ' ')
console.log(timeRecord)


  return (
    <>
    <div className="menuitempage">
        <div className="menuitembox">
            <div className="buyleftside">
      <h1>Buy {item.species}</h1>
      <div className="menuitemdetails">
        <p><strong>ID:</strong> {item.id}</p>
        <p><strong>Species:</strong> {item.species}</p>
        <p><strong>Price per lb:</strong> ${item.pricePerLb.toFixed(2)}</p>
        <p><strong>Total Available:</strong> {item.totalLbAvail} lbs</p>
      </div>
      <form className="purchaseform">
        <label htmlFor="weight">Enter weight (lbs):</label>
        <input
          id="weight"
          type="number"
          min=""
          max={item.totalLbAvail}
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
        />
        <p><strong>Total Cost:</strong> ${totalCost.toFixed(2)}</p>
        <button type="button" onClick={handlePurchase} disabled={!weight}>
          Buy Now
        </button>
      </form>
      {successMessage && <p className="successmessage">{successMessage}</p>}
            </div>
            <div className="buyrightside">
    <div className="mapcontainer">
        <MapDisplay latitude={osmUrl[0]} longitude={osmUrl[1]}/>
            </div>
            <div className="timebanner">Time of catch: {timeRecord}</div>
            </div>
      
      
      </div>
    </div>
    <BackButton />
    </>
  );
};

export default MenuItem;
