// store API url
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// read the json
d3.json(queryUrl, function(data) {
  createFeatures(data.features);
});


var basemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  maxZoom: 18,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

function createMap(earthquake) {  
    // base map
    var baseMaps = {
      "Map": basemap
    };
  
    // earthquake overlay
    var overlayMaps = {
      "Earthquakes" : earthquake    
    };
  
    // create map
    var myMap = L.map("map", {
      center: [
        39.8283, -98.5795
      ],
      zoom: 5,
      layers: basemap
    });
  
    //add layers to map
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

    //legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend');
     div.innerHTML = `<p> 0-1 Matcha Green</p>
                      <p>1-2: Mikado Yellow</p>
                      <p>2-3: Portland Orange-Pink</p>
                      <p>3-4: Cardinal Pink</p>
                      <p>4-5: Twilight Lavender</p>
                      <p>5+: Tyrian Purple</p>`
  return div;
};

legend.addTo(myMap);
  }

function createFeatures(eqdata) {

  // size of circle
  function getSize(d) {
    return d*6.5;
  }
//color of circle
  function getColor(d) {
    return d > 5 ? '#581845' :
           d > 4 ? '#824A5A' :
           d > 3 ? '#C70039' :
           d > 2 ? '#FF5733' :
           d > 1 ? '#FFC300' :           
                   '#689F38';  
  }

//circle features
  function geojsonMarkerOptions (feature) {
    return {
      radius: getSize(feature.properties.mag),
      fillColor: getColor(feature.properties.mag),
      opacity: 0.0,
      fillOpacity: 1
    };
  }

  // //creates pop-up info
  //  function onEachFeature(feature, layer) {
  //   layer.bindPopup("<h3>" + feature.properties.place +
  //     "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  // }

  // var earthquake1 = L.geoJSON(eqdata, {
  //   onEachFeature: onEachFeature
  // });

  var earthquake = L.geoJSON(eqdata, {
    pointToLayer: function (feature, coords) {
      return L.circleMarker(coords, geojsonMarkerOptions(feature));
    }
  });

 
  // createMap(earthquake1);
  createMap(earthquake);
}



