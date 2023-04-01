let bounds = [
    [50, 50], // padding
    [1024, 1024], // image dimensions
  ];
  
  // L.CRS.Simple
  //  A simple CRS that maps longitude and latitude into `x` and `y` directly.
  // May be used for maps of flat surfaces (e.g. game maps).
  let map = L.map("map", {
    crs: L.CRS.Simple,
    maxZoom: 1,
    minZoom: 0,
    maxBounds: bounds,
  });
  
  // Used to load and display a single image over
  // specific bounds of the map. Extends `Layer`.
  L.imageOverlay("assets/images/nuage.png", bounds).addTo(map);
  
  // method fitBounds sets a map view
  // that contains the given geographical bounds with the
  // maximum zoom level possible.
  map.fitBounds(bounds);