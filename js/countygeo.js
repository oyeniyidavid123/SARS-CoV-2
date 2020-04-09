


let countyMap = L.map("countymap").setView([39.8283, -98.5795], 3);

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_key
}).addTo(countyMap);

let county = [ 'akCounties', 'alCounties', 'arCounties', 'azCounties', 'caCounties', 'coCounties', 'ctCounties', 'dcCounties', 'deCounties', 'flCounties', 'gaCounties', 'hiCounties',
'iaCounties', 'idCounties', 'ilCounties', 'inCounties', 'ksCounties', 'kyCounties', 'laCounties', 'maCounties', 'mdCounties', 'meCounties',
'miCounties', 'mnCounties', 'moCounties', 'msCounties', 'mtCounties', 'ncCounties', 'ndCounties', 'neCounties', 'nhCounties', 'njCounties',
'nmCounties', 'nvCounties', 'nyCounties', 'ohCounties', 'okCounties', 'orCounties', 'paCounties', 'prCounties',
'riCounties', 'scCounties', 'sdCounties', 'tnCounties', 'txCounties', 'utCounties', 'vaCounties', 'vtCounties', 'waCounties', 'wiCounties', 'wvCounties', 'wyCounties'  ];

county.forEach(county => {
    
    let geoCounty = `../data/geoData/${county}.geo.json`;

    d3.json(geoCounty, function(data) {
        console.log(data);
        L.geoJSON(data, {
          style: {fillcolor: 'red', fillOpacity: 0.5},
          minZoom: 8,
          onEachFeature: function(feature, layer) {

            layer.bindPopup("County: " + feature.properties.name)

              layer.on({

                  click: function(event) {
                      myMap.fitBounds(event.target.getBounds());
                  },

                  mouseover: function(event) {
                      layer = event.target;
                      layer.setStyle({
                          fillOpacity: 0.9
                      });
                  },
      
                  mouseout: function(event) {
                      layer = event.target;
                      layer.setStyle({
                          fillOpacity: 0.5
                      });
                  },
              })
          },
        }).addTo(countyMap);
    });
});