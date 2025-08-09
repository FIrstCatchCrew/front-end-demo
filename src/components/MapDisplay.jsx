

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const MapDisplay = ({ latitude, longitude }) => {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={6}
      style={{ height: "100%", width: "auto" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[latitude, longitude]}>
        <Popup>
          Latitude: {latitude}, Longitude: {longitude}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapDisplay;
