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

let csvPath = '../data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
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
            //save array into graphJSON
            caseJSON = row;
            caseArray = (Object.values(row).slice(4));
        };
    });

    // set x scales for axes

    let xTimeScale = d3.scaleTime()
        .domain(d3.extent(dateArray))
        .range([0, chartWidth])

    // set y scales for axes

    let yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(caseArray)])
        .range([chartHeight, 0])

    
    // create Axes
    let bottomAxis = d3.axisBottom(xTimeScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    //configure line function for drawing line
    let drawLine = d3.line()
        .x(function(data) {return xTimeScale(data.dates)})
        .y(function(data) {return yLinearScale(data.cases)})
        .curve(d3.curveMonotoneX);

    // add line as svg path using line function
    chartGroup.append('path')
        .attr('d', drawLine(caseJSON))
        .classed('line', true);

    //append the left and bottom axes to svg group
    chartGroup.append('g')
        .classed('axis', true)
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    chartGroup.append('g')
        .classed('axis', true)
        .call(leftAxis);

    //draw axis labels
    // x axis labels
    // let xLabelObject = {};

    // xLabelObject['healthcare'] = chartGroup.append('text')
    //     .attr('transform', `translate(${chartWidth/2}, ${chartHeight + chartMargins.top - 50})`)
    //     .classed('active', true)
    //     .text('% of Households with Healthcare');
    
    // xLabelObject['age'] = chartGroup.append('text')
    //     .attr('transform', `translate(${chartWidth/2}, ${chartHeight + chartMargins.top - 30})`)
    //     .classed('inactive', true)
    //     .text('Average Household Age');

    // xLabelObject['income'] = chartGroup.append('text')
    //     .attr('transform', `translate(${chartWidth/2}, ${chartHeight + chartMargins.top - 10})`)
    //     .classed('inactive', true)
    //     .text('Average Household Income');

    // y axis labels

    // let yLabelObject = {};
    // yLabelObject['obesity'] = chartGroup.append('text')
    //     .attr('transform', `translate(${chartMargins.left - 140}, ${chartHeight/2}) rotate(-90)`)
    //     .classed('active', true)
    //     .text('% of Households with an Obese Adult');

    // yLabelObject['poverty'] = chartGroup.append('text')
    //     .attr('transform', `translate(${chartMargins.left - 160}, ${chartHeight/2}) rotate(-90)`)
    //     .classed('inactive', true)
    //     .text('% of Households in Poverty');

    // yLabelObject['smokes'] = chartGroup.append('text')
    //     .attr('transform', `translate(${chartMargins.left - 180}, ${chartHeight/2}) rotate(-90)`)
    //     .classed('inactive', true)
    //     .text('% of Households with Smokers');

    // Let's add tooltips - fun for the whole family
    // create tooltip and call to svg chart area
    // let toolTip = d3.tip()
    //     .attr('class', 'd3-tip')
    //     .offset([120,80])
    //     .html(function(d) {
    //         return (`<p><strong>${d.state}</strong></p>
    //         <p>${d.healthcare}% have healthcare</p>
    //         <p>${d.poverty}% in poverty</p>`);
    //     });

    // chartGroup.call(toolTip);

    // create listener for mouseover to show tooltips
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


