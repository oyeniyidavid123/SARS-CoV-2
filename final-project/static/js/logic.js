function markerSize(cases) {
  return cases * 15;
}





let confirmedMarker = [];
let deathMarker = [];
let recoveredMarker = [];

for (var i = 0; i < mapData.length; i++) {
  confirmedMarker.push(
    L.circle([mapData[i].Lat, mapData[i].Long_], {
      stroke: false,
      fillOpacity: 0.75,
      color: "yellow",
      fillColor: "yellow",
      radius: markerSize(mapData[i].Confirmed)
    })
  );


  deathMarker.push(
    L.circle([mapData[i].Lat, mapData[i].Long_], {
      stroke: false,
      fillOpacity: 0.75,
      color: "red",
      fillColor: "red",
      radius: markerSize(mapData[i].Deaths)
    })
  );
}

let stateConMarker = [];
let stateDeathMarker = [];

for (var i = 0; i <stateData.length; i++) {
  stateConMarker.push(
    L.circle([stateData[i].Lat, stateData[i].Long_], {
      stroke: false,
      fillOpacity: 0.75,
      color: "orange", 
      fillColor: "orange",
      radius: (stateData[i].Confirmed * 15)
    }).bindPopup("<h1>Confirmed:" + mapData[i].Confirmed + "</h1")
  );

  stateDeathMarker.push(
    L.circle([stateData[i].Lat, stateData[i].Long_], {
      stroke: false,
      fillOpacity: 0.75,
      color: "purple", 
      fillColor: "purple",
      radius: (stateData[i].Deaths * 15)
    })
  );
}
let countyConMarker = [];
let countyDeathMarker = [];
for (var i = 0; i < countyData.length; i++) {
  countyConMarker.push(
    L.circle([countyData[i].Lat, countyData[i].Long_], {
      stroke: false,
      fillOpacity: 0.75,
      color: "blue",
      fillColor: "blue",
      radius: (countyData[i].Confirmed * 15)

    })
  );

countyDeathMarker.push(
  L.circle([countyData[i].Lat, countyData[i].Long_], {
    stroke: false,
    fillOpacity: 0.75,
    color: "red",
    fillColor: "red",
    radius: (countyData[i].Confirmed * 15)
  })
);
}




let streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

let darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});

let confirmedLayer = L.layerGroup(confirmedMarker);
let deathLayer = L.layerGroup(deathMarker);
let stateConLayer = L.layerGroup(stateConMarker);
let stateDeathLayer = L.layerGroup(stateDeathMarker);
let countyConLayer = L.layerGroup(countyConMarker);
let countyDeathLayer = L.layerGroup(countyDeathMarker);

let baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap
};

let overlayMaps = {
  confirmed: confirmedLayer,
  deaths: deathLayer,
  "Confirmed by State (US)": stateConLayer,
  "Deaths by State (US)": stateDeathLayer,
  "Confirmed by County (US)": countyConLayer,
  "Deaths by County (US)": countyDeathLayer
};

const map = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5,
  layers: [streetmap, confirmedLayer, deathLayer, stateConLayer, stateDeathLayer, countyConLayer, countyDeathLayer]
});

L.control.layers(baseMaps, overlayMaps).addTo(map);


