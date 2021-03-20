"use strict";

console.log("Just Works-Loaded map.js");

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWxva2luMTExMiIsImEiOiJja2lqNGZuNmwxa2M0MnFxdXJ5OXc3eXVpIn0.0WtHKNwYRMHWYT2NQ-d35g";

let map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/alokin1112/ckij6szdv6jv91atbnhdp3ozs",
  center: [20.906379004737882, 52.49028952478266],
  zoom: 14,
  preserveDrawingBuffer: true,
});
let navigation = new mapboxgl.NavigationControl({
  showCompass: false,
});
map.addControl(navigation, "top-left");
let scale = new mapboxgl.ScaleControl({
  maxWidth: 80,
  unit: "imperial",
});
map.addControl(scale, "bottom-right");

let geolocate = new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true,
  },
  trackUserLocation: true,
  showUserLocation: true,
  fitBoundsOptions: {},
});
map.addControl(geolocate, "top-left");

geolocate.on("geolocate", (e) => {});

let current_location = [20.906379004737882, 52.49028952478266];

geolocate.on("geolocate", function (event) {
  current_location = [event.coords.longitude, event.coords.latitude];
  console.log("geolocated", current_location);

  if (active) {
    path.push(current_location);
    map.getSource("drawing").setData(geojson);
  }
});

map.on("click", function (event) {
  current_location = [event.lngLat.lng, event.lngLat.lat];
  console.log("clicked", current_location);

  if (active) {
    path.push(current_location);
    console.log(path);
    map.getSource("drawing").setData(geojson);
  }
});

let active = false;
let start_marker = new mapboxgl.Marker();
let path = [];

function startDrawing() {
  active = true;

  start_marker.setLngLat(current_location);
  start_marker.addTo(map);

  draw_btn.style["background-color"] = "red";
  draw_btn.style["color"] = "white";
  draw_btn.value = "Stop and save";

  path.push(current_location);

  geojson.features.push({
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: path,
    },
  });
  map.getSource("drawing").setData(geojson);
}

function stopDrawing() {
  active = false;

  draw_btn.style["background-color"] = "white";
  draw_btn.style["color"] = "black";
  draw_btn.value = "Start";
  const data = { path: path };
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  const response = fetch("/api", options);
}

let draw_btn = document.getElementById("draw_btn");
draw_btn.addEventListener("click", function () {
  console.log("clicked draw_btn");

  if (active) {
    stopDrawing();
  } else {
    startDrawing();
  }
});

map.on("load", function () {
  map.addLayer({
    id: "drawing",
    type: "line",
    source: {
      type: "geojson",
      data: null,
    },
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "red",
      "line-width": 5,
      "line-opacity": 0.8,
    },
  });
});

let geojson = {
  type: "FeatureCollection",
  features: [],
};
