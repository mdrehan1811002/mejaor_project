// let mapToken = mapToken;
// console.log(mapToken);
// const listing1 = listing;
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 11, // starting zoom
});

console.log(listing.geometry.coordinates);

const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
  `<p> Since you're showing a listing's location</p> <b>${listing.location}</b>`
);

const marker = new mapboxgl.Marker({ color: "black", rotation: 45 })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(popup)
  .addTo(map);

// map.on("load", () => {
//   // Create a DOM element for the custom marker
//   const el = document.createElement("div");
//   el.className = "custom-marker";
//   el.style.backgroundImage =
//     "url(https://res.cloudinary.com/ddgx0xvvu/image/upload/v1747253961/home_m7wzmn.png)";
//   el.style.width = "40px";
//   el.style.height = "40px";
//   el.style.backgroundSize = "cover";
//   el.style.borderRadius = "50%";
//   el.style.cursor = "pointer";
//   el.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.5)";

//   // Add the marker
//   const marker = new mapboxgl.Marker(el)
//     .setLngLat(listing.geometry.coordinates)
//     .setLngLat([-74.5, 40])
//     .setPopup(popup) // optional
//     .addTo(map);
// });
