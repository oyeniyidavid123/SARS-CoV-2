let map = L.map('geomap', {
    center: [37.09, -95.713],
    zoom: 3
});

L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_key
}).addTo(map);

let states = [ 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY' ];

//loop to add all state geoJSON data
states.forEach(state => {
    //set paths 
    let geoPath = `/data/geoData/countries/USA/${state}.geo.json`;

    d3.json(geoPath).then(function(data) {
        console.log(data);
        L.geoJSON(data, {
            // add styles to each geoJSON 
            style: {fillColor: 'purple', fillOpacity: 0.5},
            onEachFeature: function(feature, layer) {

                // add listeners to each state geoJSON
                layer.on({
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
                    }

                })
            }
        }).addTo(map);
    });
})


