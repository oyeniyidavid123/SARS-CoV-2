Plotly.d3.csv('/data/cleaned_us_pop.csv', function(err, rows){
      function unpack(rows, key) {
          return rows.map(function(row) { return row[key]; });
      }
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
              thickness: 0.2
          },
          marker: {
              line:{
                  color: 'rgb(255,255,255)',
                  width: 2
              }
          }
      }];


      var layout = {
          title: '2019 US Population by State',
          geo:{
              scope: 'usa',
              showlakes: true,
              lakecolor: 'rgb(255,255,255)'
          }
      };

      Plotly.newPlot("myDiv", data, layout, {showLink: false});
});









// function buildMetadata(sample) {
//   d3.json("samples.json").then((data) => {
//     let metadata = data.metadata;
//     // Filter the data for the object with the desired sample number
//     let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
//     let result = resultArray[0];
//     // Use d3 to select the panel with id of `#sample-metadata`
//     let PANEL = d3.select("#sample-metadata");

//     // Use `.html("") to clear any existing metadata
//     PANEL.html("");

//     // Use `Object.entries` to add each key and value pair to the panel
//     // Hint: Inside the loop, you will need to use d3 to append new
//     // tags for each key-value in the metadata.
//     Object.entries(result).forEach(([key, value]) => {
//       PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
//     });

//     // BONUS: Build the Gauge Chart
//     buildGauge(result.wfreq);
//   });
// }

// function buildCharts(sample) {
//   d3.json("samples.json").then((data) => {
//     let samples = data.samples;
//     let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
//     let result = resultArray[0];

//     let otu_ids = result.otu_ids;
//     let otu_labels = result.otu_labels;
//     let sample_values = result.sample_values;

//     // Build a Bubble Chart
//     let bubbleLayout = {
//       title: "Bacteria Cultures Per Sample",
//       margin: { t: 0 },
//       hovermode: "closest",
//       xaxis: { title: "OTU ID" },
//       margin: { t: 30}
//     };
//     let bubbleData = [
//       {
//         x: otu_ids,
//         y: sample_values,
//         text: otu_labels,
//         mode: "markers",
//         marker: {
//           size: sample_values,
//           color: otu_ids,
//           colorscale: "Earth"
//         }
//       }
//     ];

//     Plotly.newPlot("bubble", bubbleData, bubbleLayout);

//     let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
//     let barData = [
//       {
//         y: yticks,
//         x: sample_values.slice(0, 10).reverse(),
//         text: otu_labels.slice(0, 10).reverse(),
//         type: "bar",
//         orientation: "h",
//       }
//     ];

//     let barLayout = {
//       title: "Top 10 Bacteria Cultures Found",
//       margin: { t: 30, l: 150 }
//     };

//     Plotly.newPlot("bar", barData, barLayout);
//   });
// }

// function init() {
//   // Grab a reference to the dropdown select element
//   let selector = d3.select("#selDataset");

//   // Use the list of sample names to populate the select options
//   d3.json("samples.json").then((data) => {
//     let sampleNames = data.names;

//     sampleNames.forEach((sample) => {
//       selector
//         .append("option")
//         .text(sample)
//         .property("value", sample);
//     });

//     // Use the first sample from the list to build the initial plots
//     let firstSample = sampleNames[0];
//     buildCharts(firstSample);
//     buildMetadata(firstSample);
//   });
// }

// function optionChanged(newSample) {
//   // Fetch new data each time a new sample is selected
//   buildCharts(newSample);
//   buildMetadata(newSample);
// }

// // Initialize the dashboard
// init();
