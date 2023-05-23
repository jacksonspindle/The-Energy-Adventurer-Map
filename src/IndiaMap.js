import React, { useState } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import { motion } from "framer-motion";
import cities from "./citiesData.js";

const mapContainerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: 22.3511148,
  lng: 78.6677428,
};

const options = {
  disableDefaultUI: true,
  panControl: false,
  minZoom: 2,
  maxZoom: 42,
  zoomControl: false,
  clickableIcons: false,
  controlSize: 0,
  styles: [
    {
      elementType: "geometry",
      stylers: [
        {
          saturation: -100,
        },
        {
          lightness: 20,
        },
      ],
    },
    {
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
  ],
  restriction: {
    latLngBounds: {
      north: 65.5087,
      south: -25.7533,
      east: 125.3953,
      west: 40.1097,
    },
    strictBounds: true,
  },
};

const IndiaMap = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBTxO1Ipn7WOZSeY49mDclKyz009KqUXJY",
  });

  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = (value) => {
    setIsFullScreen(value);
  };

  const mapRef = React.useRef();
  const [selectedCity, setSelectedCity] = useState(null);

  const onLoad = (map) => {
    mapRef.current = map;
    map.data.loadGeoJson("india.geojson");
    map.data.setStyle({
      fillColor: "white",
      strokeWeight: 1,
      strokeColor: "black",
      fillOpacity: 0.8,
    });
  };
  const defaultZoom = 5;

  const resetMapView = () => {
    mapRef.current.panTo(center);
    mapRef.current.setZoom(defaultZoom);
    setSelectedCity(null);
  };

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  const handleMarkerClick = (city) => {
    setSelectedCity(city);

    const interval = 10; // ms
    const steps = 50; // Number of steps
    const targetZoom = 7;
    const distanceInMiles = 1;

    const currentLatLng = new window.google.maps.LatLng(
      mapRef.current.getCenter().lat(),
      mapRef.current.getCenter().lng()
    );
    const targetLatLng = new window.google.maps.LatLng(
      city.position.lat,
      city.position.lng
    );

    const newTargetLatLng = window.google.maps.geometry.spherical.computeOffset(
      targetLatLng,
      distanceInMiles * 1609.34, // Convert miles to meters
      270 // Offset angle in degrees (270 degrees is west)
    );

    const stepPanDeltaLat =
      (newTargetLatLng.lat() - currentLatLng.lat()) / steps;
    const stepPanDeltaLng =
      (newTargetLatLng.lng() - currentLatLng.lng()) / steps;

    for (let i = -10; i <= steps; i++) {
      setTimeout(() => {
        const currentCenter = mapRef.current.getCenter();
        const newCenter = {
          lat: currentCenter.lat() + stepPanDeltaLat,
          lng: currentCenter.lng() + stepPanDeltaLng,
        };
        mapRef.current.panTo(newCenter);
      }, interval * i);
    }

    // Zoom in after panning
    setTimeout(() => {
      mapRef.current.setZoom(targetZoom);
    }, interval * steps);
  };

  const InfoWindowContent = ({ content }) => {
    const containerStyle = {
      position: "absolute",
      width: isFullScreen ? "100vw" : "30vw",
      height: isFullScreen ? "100vh" : "83%",
      top: isFullScreen ? 0 : 60,
      right: isFullScreen ? 0 : 190,
      display: isFullScreen ? "flex" : "block",
      bottom: 0,
    };

    const articleContainerStyle = {
      padding: isFullScreen ? "0 20%" : "20px 45px 0 45px",
      borderRadius: isFullScreen ? "none" : "1rem",
    };

    return (
      <motion.div
        className="info-window-content"
        style={containerStyle}
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        exit={{ opacity: 0 }}
      >
        <img
          alt="fullscreen icon"
          className="x-icon"
          src="/xIcon.svg"
          onClick={() => {
            setSelectedCity(null);
            toggleFullScreen(false);
          }}
          style={{
            right: isFullScreen ? 10 : "-75px",
          }}
        />
        <img
          alt="fullscreen icon"
          className="fullscreen-icon"
          src="/fullscreenIcon.png"
          onClick={() => toggleFullScreen(!isFullScreen)}
        />
        <div className="article-container" style={articleContainerStyle}>
          {content}
        </div>
      </motion.div>
    );
  };
  return (
    <>
      <div className="map-container">
        {isFullScreen ? null : (
          <button className="reset-button" onClick={resetMapView}>
            Reset View
          </button>
        )}
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={5}
          center={center}
          options={options}
          onLoad={onLoad}
        >
          {cities.map((city, index) => (
            <MarkerF
              key={index}
              position={city.position}
              title={city.name}
              // onClick={() => setSelectedCity(city)}
              onClick={() => handleMarkerClick(city)}
              icon={{
                url: "https://em-content.zobj.net/thumbs/160/apple/76/round-pushpin_1f4cd.png",
                scaledSize: new window.google.maps.Size(60, 60),
                anchor: new window.google.maps.Point(14, 60),
              }}
            />
          ))}
          {selectedCity && (
            <InfoWindowContent content={<selectedCity.articleContent />} />
          )}
        </GoogleMap>
      </div>
    </>
  );
};

export default IndiaMap;
