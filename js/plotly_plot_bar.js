function handleSubmit() {
    d3.event.preventDefault();
    let state = d3.select('#State_input').node().value;
    // clear the input value
    d3.select('#State_input').node().value = "";
    
    buildPlot(state);
  }

function buildPlot(state) {

  d3.json(data/us_states.json).then(function(data) {
    // Grab values from the response json object to build the plots
    console.log('data', data)
    let state = data.state;
    let dates = data.date;
    let cases = data.cases;
    let deaths = data.deaths;
    // Print the names of the columns
    //console.log(data.dataset.column_names);
    // Print the data for each day
    //console.log(data.dataset.data);
    // Use map() to build an array of the the dates
    let dates = data.dataset.data.map(row => row[0]);
    // Use map() to build an array of the closing prices
    let closingPrices = data.dataset.data.map(row => row[4]);
    
    
    let caseTrace = {
      type: "bar",
      orientation: 'h',
      name: 'Total Cases',
      x: dates,
      y: cases,
      bar: {
        color: "rbg(42, 129, 222)"
      }
    };

    let deathTrace = {
    type: "bar",
    orientation:'h',
    name: 'Deaths',
    x: dates,
    y: deaths,
    bar: {
      color: 'rbg(222, 42, 42)'
    }

    };
    let barChartData = [caseTrace,deathTrace];
    let layout = {
      title: `${State} Total Case & Death toll`,
      barmode:'stack',
      xaxis: {
        autorange: true,
        type: "date"
      },
      yaxis: {
        autorange: true,
        type: "linear"
      }
    };
    Plotly.newPlot("bar_state", barChartData, layout);
  });
}
// Add event listener for submit button
d3.select('#submit').on('click', handleSubmit);



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



// // Initialize the dashboard
// init();










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


// function optionChanged(newSample) {
//   // Fetch new data each time a new sample is selected
//   buildCharts(newSample);
//   buildMetadata(newSample);
// }

// // Initialize the dashboard
// init();
