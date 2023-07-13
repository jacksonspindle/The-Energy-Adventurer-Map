import React from "react";
import "./App.css";
import IndiaMap from "./IndiaMap";

function App() {
  return (
    <div className="App">
      <h1
        style={{
          height: 50,
          fontSize: 20,
          margin: 0,
          position: "absolute",
          zIndex: 10,
          width: "100%",
          backgroundColor: "black",
          color: "white",
        }}
      >
        Energy Adventure(r)
        <p style={{ fontSize: 15, marginTop: "3px" }}>Bill Spindle</p>
      </h1>

      <IndiaMap />
      <div
        style={{
          position: "absolute",
          zIndex: 10,
          bottom: 0,
          right: 0,
          width: "100%",
          backgroundColor: "black",
          color: "white",
          height: "auto",
          fontSize: 15,
        }}
      >
        <p style={{ marginLeft: "20px", marginRight: "20px" }}>
          From coal country in the east to desert solar farms in the west,
          Himalayan hilltops in the north to tidal wetlands in the south, Energy
          Adventure(r) explores India's climate and energy journey. Where it
          leads matters to the entire world.
        </p>
      </div>
    </div>
  );
}

export default App;
