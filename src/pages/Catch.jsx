import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import BackButton from "../components/BackButton";
import "leaflet/dist/leaflet.css";

const Catch = () => {
  const [formData, setFormData] = useState({
    species: "",
    pricePerLb: 0.0,
    timeOfCatch: "",
    location: "", // Google Maps URL
    fisher: "",
    totalLbAvail: 0.0,
  });

  const [selectedPosition, setSelectedPosition] = useState({ lat: 48.8795, lon: -53.0047 }); // Default to Newfoundland waters
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const formattedPrice = parseFloat(formData.pricePerLb);
    if (isNaN(formattedPrice)) {
      setErrorMessage("Price must be a valid number.");
      return;
    }

    const capitalize = (str) => str.toUpperCase();

    const googleMapsUrl = `https://www.google.com/maps?q=${selectedPosition.lat},${selectedPosition.lon}`;
    const formattedData = {
      ...formData,
      species: capitalize(formData.species),
      pricePerLb: formattedPrice,
      location: googleMapsUrl,
      fisher: capitalize(formData.fisher),
    };

    try {
      const res = await fetch("http://localhost:5000/menuitems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!res.ok) throw new Error("Failed to add the new catch.");

      setSuccessMessage("Catch added successfully!");
      setFormData({
        species: "",
        pricePerLb: 0.0,
        timeOfCatch: "",
        location: "",
        fisher: "",
        totalLbAvail: 0.0,
      });
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const LocationSelector = () => {
    useMapEvents({
      click(e) {
        setSelectedPosition({ lat: e.latlng.lat, lon: e.latlng.lng });
      },
    });

    return null;
  };

  return (
    <>
      <div className="newcatchpage">
        <h1 className="catchtitle">Add New Catch</h1>
        <form className="catchform" onSubmit={handleSubmit}>
        <div>
          <div className="form-group">
            <label htmlFor="species">Species</label>
            <input
              type="text"
              id="species"
              name="species"
              value={formData.species}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="pricePerLb">Price (per lb)</label>
            <input
              type="number"
              id="pricePerLb"
              name="pricePerLb"
              step="0.01"
              value={formData.pricePerLb}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="timeOfCatch">Time of Catch</label>
            <input
              type="datetime-local"
              id="timeOfCatch"
              name="timeOfCatch"
              value={formData.timeOfCatch}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="fisher">Fisher</label>
            <input
              type="text"
              id="fisher"
              name="fisher"
              value={formData.fisher}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="totalLbAvail">Total Available (lb)</label>
            <input
              type="number"
              id="totalLbAvail"
              name="totalLbAvail"
              step="0.01"
              value={formData.totalLbAvail}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Add Catch</button>
          {successMessage && <p className="success">{successMessage}</p>}
        {errorMessage && <p className="error">{errorMessage}</p>}
          </div>

          <div className="form-group">
            <label>Location</label>
            <div style={{ height: "300px", width: "100%", marginBottom: "1rem", border: "0.1rem solid #d12121", borderRadius:".2rem"  }}>
              <MapContainer
                center={[selectedPosition.lat, selectedPosition.lon]}
                zoom={8}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[selectedPosition.lat, selectedPosition.lon]}>
                  <Popup>
                    Latitude: {selectedPosition.lat}, Longitude: {selectedPosition.lon}
                  </Popup>
                </Marker>
                <LocationSelector />
              </MapContainer>
            </div>
            <p>
              Selected Location:{" "}
              <strong>
                {selectedPosition.lat.toFixed(5)}, {selectedPosition.lon.toFixed(5)}
              </strong>
            </p>
          </div>
          
        
        </form>
      </div>
      <BackButton />
    </>
  );
};

export default Catch;
