// svg dimensions
let svgHeight = 700,
    svgWidth = 1000;

// make responsive function
function makeResponsive() {

  var svgArea = d3.select("#dataGraph").select("svg");
  if (!svgArea.empty()) {
    svgArea.remove();
  }}

// set chart margins
let chartMargins = {
    top: 100,
    right: 100,
    bottom: 100,
    left: 100
};

// set chart dimensions
let chartWidth = svgWidth - chartMargins.left - chartMargins.right;
let chartHeight = svgHeight - chartMargins.top - chartMargins.bottom;

// create svg and svg group html elements
let svg = d3.select('#dataGraph')
    .append('svg')
    .attr('height', svgHeight)
    .attr('width', svgWidth);

let chartGroup = svg.append('g')
    .attr('transform', `translate(${chartMargins.left}, ${chartMargins.top})`);


    

// read csv and draw

let csvPath = '/data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
d3.csv(csvPath).then(csvData => {
    // date parsing function to turn all date strings into dates
    dateArray = [];
    let parseTime = d3.timeParse("%m/%d/%y");
    csvData.columns.slice(4).forEach(date => {
        dateArray.push(parseTime(date));
    });

    // nested forEach to convert case values to int
    csvData.forEach(function(country) {
        csvData.columns.slice(4).forEach(date => {
            country[`${date}`] = +country[`${date}`];
            
        });
    });

     // create array of cases for US
     csvData.forEach(row =>{
        //if country matches then create array of # of cases 
        if (row['Country/Region'] === 'US') {
            caseArray = (Object.values(row).slice(4));
        };
    });

    // Loop to create data list of objects for data binding
    let data = [];
    dateArray.forEach((date, index) => {
        data.push({'date': date, 'cases': caseArray[index]});
    });
    // add the first entry to the end of the array for a complete polygon
    data.push(data[0]);

    // Set circle inner and outer radii
    let innerRadius = 100,
        outerRadius = d3.min([chartWidth, chartHeight])/2; // outer radius is scaled to the size of the height or 
        //width of the svg, whichever is smaller

    //set circle centers
    let cxCenter = `${chartWidth/2 - 150}`,
     cyCenter = `${chartWidth/2 - 210}`;

    // set other circle values
    circleRadians = 2 * Math.PI;

    // set x scales for dates to angles in radians
    let x = d3.scaleTime()
        .domain(d3.extent(dateArray))
        .range([0, circleRadians]);
    
    // set y scales for scales to radius
    let y = d3.scaleRadial()
        .domain([0, d3.max(caseArray)])
        .range([innerRadius, outerRadius]);
    

    //configure line function for drawing line
    let drawLine = d3.lineRadial()
        .angle(function(d) {return x(d.date)})
        .radius(function(d) {return y(d.cases)});

    // add line as svg path using line function
    let radialLine = chartGroup.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#4099ff')
        .attr('d', drawLine)
        .attr('id', 'dataLine')
        .attr('transform', `translate(${cxCenter}, ${cyCenter})`);


    // Let's add tooltips - fun for the whole family
    // create tooltip and call to svg chart area
    let toolTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([120,80])
        .html(function(d) {
            return (`<p><strong>${d.state}</strong></p>
            <p>${d.healthcare}% have healthcare</p>
            <p>${d.poverty}% in poverty</p>`);
        });

    chartGroup.call(toolTip);

    function animate(line){
        if(line == 0) {
            //set lines to invisible
            d3.selectAll('line').style('opacity', '0');
        }

        let lineLength = d3.select('#dataLine').node().getTotalLength();
        d3.selectAll('#dataLine')
            //set line to double length, with half being an empty dash
            .attr('stroke-dasharray', lineLength + " " + lineLength)
            // set initial empty dash to be the visible part
            .attr('stroke-dashoffset', lineLength)
            .transition()
            .duration(1000)
            .easeCubicOut()
            .attr('stroke-dashoffset', 0);
    }

    animate(0);


    // // create listener for mouseover to show tooltips
    // stateLabels.on('mouseover', function(d){
    //     toolTip.show(d, this);
    // })
    // .on('mouseout', function(d){
    //     toolTip.hide(d);

    // });

    // create .on() listener for clicks on axes
    // Object.keys(xLabelObject).forEach(key => {
    //     xLabelObject[`${key}`].on('click', function(){

    //         //move all circle markers
    //         stateCircles.transition()
    //         .duration(500)
    //         .attr('cx', d => XScales[`${key}`](d[`${key}`]));

    //         //move all text labels
    
    //         stateLabels.transition()
    //         .duration(500)
    //         .attr('x', d => XScales[`${key}`](d[`${key}`]));

    //         // move axes on click
    //         bottomAxisGroup.transition()
    //         .duration(500)
    //         .attr('transform', `translate(${bottomAxisPositions[key]}, 0)`);
        
    // });

    // });
    
    // create .on() listener for clicks on Y axes
    // Object.keys(yLabelObject).forEach(key => {
    //     yLabelObject[`${key}`].on('click', function(){

    //         //move all circle markers
    //         stateCircles.transition()
    //         .duration(500)
    //         .attr('cy', d => YScales[`${key}`](d[`${key}`]));

    //         //move all text labels
    
    //         stateLabels.transition()
    //         .duration(500)
    //         .attr('y', d => YScales[`${key}`](d[`${key}`]))

    //         // move axes on click
    //         leftAxisGroup.transition()
    //         .duration(500)
    //         .attr('transform', `translate(0, ${leftAxisPositions[key]})`)
        
    // });

    // });
}
    ).catch(function(error) {
        console.log(error);
    });
    
// makeResponsive();
// d3.select(window).on("resize", makeResponsive);


