"use client";
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as d3 from "d3";

const MapComponent = ({ dataUrl, initialView, mapId }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Initialize the map
    const map = L.map(mapRef.current).setView(initialView, 8);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Load and process the CSV data using D3.js
    d3.csv(dataUrl).then((data) => {
      const svgLayer = L.svg().addTo(map); // Add an SVG overlay to the map
      const overlay = d3.select(map.getPanes().overlayPane).select("svg");

      // Bind data and append points
      overlay
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr(
          "cx",
          (d) => map.latLngToLayerPoint([+d.Start_Lat, +d.Start_Lng]).x
        )
        .attr(
          "cy",
          (d) => map.latLngToLayerPoint([+d.Start_Lat, +d.Start_Lng]).y
        )
        .attr("r", 2) // Small radius to simulate a point
        .attr("fill", "blue") // Uniform color for all points
        .attr("opacity", 0.6);

      // Update point positions on map zoom or move
      const updatePositions = () => {
        overlay
          .selectAll("circle")
          .attr(
            "cx",
            (d) => map.latLngToLayerPoint([+d.Start_Lat, +d.Start_Lng]).x
          )
          .attr(
            "cy",
            (d) => map.latLngToLayerPoint([+d.Start_Lat, +d.Start_Lng]).y
          );
      };

      map.on("moveend", updatePositions); // Update points on map move
      map.on("zoomend", updatePositions); // Update points on zoom
    });
  }, [dataUrl, initialView]);

  return (
    <div ref={mapRef} id={mapId} style={{ height: "90vh", width: "100%" }} />
  );
};

const DualMapPage = () => {
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {/* First Map */}
      <div style={{ flex: 1, padding: 10 }}>
        <div>Accident Zone points in South Carolina</div>
        <MapComponent
          dataUrl="/state_df.csv" // First dataset
          initialView={[33.8361, -81.1637]} // Initial view for map 1
          mapId="map1"
        />
      </div>

      {/* Second Map */}
      <div style={{ flex: 1, padding: 10 }}>
        <div>Accident Zone clusters in South Carolina</div>
        <MapComponent
          dataUrl="/cluster_df.csv" // Second dataset
          initialView={[33.8361, -81.1637]} // Initial view for map 2
          mapId="map2"
        />
      </div>
    </div>
  );
};

export default DualMapPage;
