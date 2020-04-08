Plotly.d3.csv('/data/cleaned_us_pop.csv', function(err, rows){
    function unpack(rows, key) {
        return rows.map(function(row) { return row[key]; });
    }
    var config = {mapboxAccessToken: "pk.eyJ1IjoiaHZidWlhbmJ1aSIsImEiOiJjazgyMW55cDIwZDZ1M3FydTF5czk2ZDZkIn0.xlbfCSQZupQLXlkcMpHLCA"};

    var data = [{
        type: 'choropleth',
        locationmode: 'USA-states',
        locations: unpack(rows, 'Postal'),
        z: unpack(rows, 'population_2019'),
        text: unpack(rows, 'State'),
        zmin: 0,
        zmax: 0,
        colorscale: [
            [0, 'rgb(242,240,247)'], [0.2, 'rgb(218,218,235)'],
            [0.4, 'rgb(188,189,220)'], [0.6, 'rgb(158,154,200)'],
            [0.8, 'rgb(117,107,177)'], [1, 'rgb(84,39,143)']
        ],
        colorbar: {
            title: 'Population',
            thickness: 2,
        },
        marker: {
            line:{
                color: 'rgb(255,255,255)',
                width: 2
            }
        }
    }];


    var layout = {
          center: {lon: -110, lat: 50}, zoom: 0.3,
          margin: {t: 50, b: -50},
          geo:{
            scope: 'usa',
            showlakes: true,
            lakecolor: 'rgb(255,255,255)'
        }
    };

    

    Plotly.newPlot("myDiv", data, layout, config);
});
