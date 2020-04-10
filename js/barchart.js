let svgWidth = 1100;
let svgHeight = 600;
let margin = {
  top: 30,
  right: 40,
  bottom: 50,
  left: 50
};
//define dimension of the chart area
let chartWidth =  svgWidth - margin.left - margin.right;
let chartHeight = svgHeight - margin.top - margin.bottom;
// select body and append svg area 
let svg = d3.select("#dtGraph")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
  //append a group to the svg and translate to the right and to the bottom
  let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
  //load data from the csv
let csvpath = '../data/us-states.csv';
d3.csv(csvpath).then(function(response) {
    console.log(response);
    response.cases = +response.cases;
//configure a band scale
var xBandScale = d3.scaleBand()
    .domain(response.map(data =>data.state))
    .range([0, chartWidth])
    .padding(0.1);
//create a linear scale for the vertical axis
var yLinearScale = d3.scaleLinear()
    // .domain([0, 1000])
    .domain([0, d3.max(response, data =>data.cases/1.02)])
    .range([chartHeight, 0])
var bottomAxis = d3.axisBottom(xBandScale).ticks(10);
var leftAxis = d3.axisLeft(yLinearScale).ticks(10);
//append the 2 svg group elements to the chartgroup
chartGroup.append("g")
    .call(leftAxis);
    // .orient("left")
    // .tickformat(function (data) {
    //     if ((data.cases/1000) >= 1) {
    //         data = data/1000 + " " + "000" + " " + "000";
    //     }
    //     return data
    // });
    // .selectAll("text")
    //     .attr("dy", ".35em")
    //     .attr("y", 0)
    //     .attr("x", 9)
    //     .attr("transform", "rotate(-90)")
    //     .style("text-anchor", "start");
chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis)
    .selectAll("text")
        .attr("dy", ".35em")
        .attr("y", 0)
        .attr("x", 9)
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");
 var barSpacing = 10; // desired space between each bar
 var scaleY = 0.2; // 10x scale on rect height
 var barWidth = (chartWidth - (barSpacing * (response.length - 1))) / response.length;
//create one svg retangle per piece of data
chartGroup.selectAll(".bar")
    .data(response)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", data => xBandScale(data.state))
    .attr("y", data => yLinearScale(data.cases))
    .attr("width", xBandScale.bandwidth())
    .attr("height", data => chartHeight -yLinearScale(data.cases));
});