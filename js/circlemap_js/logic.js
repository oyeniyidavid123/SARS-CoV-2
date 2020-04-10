function markerSize(cases) {
  return cases * 3;
}





let countryMarker = [];


//adding country data to marker

for (var i = 0; i < mapData.length; i++) {
  countryMarker.push(
    L.circle([mapData[i].Lat, mapData[i].Long_], {
      stroke: false,
      fillOpacity: 0.75,
      color: "yellow",
      fillColor: "yellow",
      radius: markerSize(mapData[i].Confirmed)
    }).bindPopup("<h1>" + mapData[i].Country_Region + "</h1> <hr> <h3>Confirmed: " + mapData[i].Confirmed + "<hr> <h3>Deaths: " + mapData[i].Deaths + "</h3>")
  );


  countryMarker.push(
    L.circle([mapData[i].Lat, mapData[i].Long_], {
      stroke: false,
      fillOpacity: 0.75,
      color: "red",
      fillColor: "red",
      radius: markerSize(mapData[i].Deaths)
    })
  );
}



let stateMarker = [];

//adding state data to marker
for (var i = 0; i <stateData.length; i++) {
  stateMarker.push(
    L.circle([stateData[i].Lat, stateData[i].Long_], {
      stroke: false,
      fillOpacity: 0.75,
      color: "yellow", 
      fillColor: "yellow",
      radius: (stateData[i].Confirmed * 3)
    }).bindPopup("<h1>" + stateData[i].State + "</h1> <hr> <h3>Confirmed: " + stateData[i].Confirmed + "<hr> <h3>Deaths: " + stateData[i].Deaths + "</h3>")
  );

  stateMarker.push(
    L.circle([stateData[i].Lat, stateData[i].Long_], {
      stroke: false,
      fillOpacity: 0.75,
      color: "red", 
      fillColor: "red",
      radius: (stateData[i].Deaths * 3)
    })
  );
}

let countyMarker = [];

//adding county data to marker
for (var i = 0; i <countyData.length; i++) {
  countyMarker.push(
    L.circle([countyData[i].Lat, countyData[i].Long_], {
      stroke: false,
      fillOpacity: 0.75,
      color: "yellow", 
      fillColor: "yellow",
      radius: (countyData[i].Confirmed * 5)
    }).bindPopup("<h1>" + countyData[i].Combined_Key + "</h1> <hr> <h3>Confirmed: " + countyData[i].Confirmed + "<hr> <h3>Deaths: " + countyData[i].Deaths + "</h3>")
  );

  countyMarker.push(
    L.circle([countyData[i].Lat, countyData[i].Long_], {
      stroke: false,
      fillOpacity: 0.75,
      color: "red", 
      fillColor: "red",
      radius: (countyData[i].Deaths * 5)
    })
  );
}




//adding tile layers

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


//adding markers to layers
let countryLayer = L.layerGroup(countryMarker);
let countyLayer = L.layerGroup(countyMarker);
let stateLayer = L.layerGroup(stateMarker);


let baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap
};

let overlayMaps = {
  "Country Data": countryLayer,
  "State Data (US)": stateLayer,
  "County Data (US)": countyLayer

};

//adding layers and tiles to map

const map = L.map("globalMap", {
  center: [
    31.65, -27.9375
  ],
  zoom: 2,
  layers: [darkmap, countryLayer]
});

L.control.layers(baseMaps, overlayMaps).addTo(map);
