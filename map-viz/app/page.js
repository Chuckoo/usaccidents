"use client";
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as d3 from "d3";

const PointMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Initialize the map
    const map = L.map(mapRef.current).setView([37.8, -96], 4);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Load and process the CSV data using D3.js
    d3.csv("/cluster_df.csv").then((data) => {
      const svgLayer = L.svg().addTo(map); // Add an SVG overlay to the map
      const overlay = d3.select(map.getPanes().overlayPane).select("svg");

      // Bind data and append points
      overlay
        .selectAll("circle") // Use 'circle' to represent points in SVG
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => map.latLngToLayerPoint([+d.Lat, +d.Long]).x)
        .attr("cy", (d) => map.latLngToLayerPoint([+d.Lat, +d.Long]).y)
        .attr("r", 2) // Use a very small radius to simulate a point
        .attr("fill", "blue") // Uniform color for all points
        .attr("opacity", 0.6);

      // Update point positions on map zoom or move
      const updatePositions = () => {
        overlay
          .selectAll("circle")
          .attr("cx", (d) => map.latLngToLayerPoint([+d.Lat, +d.Long]).x)
          .attr("cy", (d) => map.latLngToLayerPoint([+d.Lat, +d.Long]).y);
      };

      map.on("moveend", updatePositions); // Update points on map move
      map.on("zoomend", updatePositions); // Update points on zoom
    });
  }, []);

  return <div ref={mapRef} style={{ height: "100vh", width: "100%" }} />;
};

export default PointMap;
