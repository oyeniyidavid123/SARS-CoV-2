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
    // date parsing function to turn all date strings into dates, and a slider array for slider values
    dateArray = [];
    sliderArray = [];
    let parseTime = d3.timeParse("%m/%d/%y");
    csvData.columns.slice(4).forEach(date => {
        dateArray.push(parseTime(date));
        sliderArray.push(date);
    });
    
    let casesDate = '1/22/20';
    // nested forEach to convert case values to int
    csvData.forEach(function(country) {
        csvData.columns.slice(4).forEach(date => {
            country[`${date}`] = +country[`${date}`];
            
        });
    });

     // create array of countries
     countryArray = [];
     csvData.forEach(row =>{
        //if country matches then create array of # of cases 
        countryArray.push(row['Country/Region'])
    });

    csvData.push(csvData[0]); // add the first entry to the end to make a complete circle

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
    let x = d3.scaleLinear()
        .domain([0, csvData.length])
        .range([0, circleRadians]);
    
    // set y scales according to the highest number of cases to radius
    let y = d3.scaleRadial()
        .domain([0, d3.max(csvData, data => data[`${casesDate}`])])
        .range([innerRadius, outerRadius]);
    

    //configure line function for drawing line
    let drawLine = d3.lineRadial()
        .angle(function(d) {return x(csvData.indexOf(d))})
        .radius(function(d) {return y(d[`${casesDate}`])});

    // add line as svg path using line function
    let radialLine = chartGroup.append('path')
        .datum(csvData)
        .attr('fill', 'none')
        .attr('stroke', '#4099ff')
        .attr('stroke-width', '3')
        .attr('d', drawLine)
        .attr('id', 'dataLine')
        .attr('transform', `translate(${cxCenter}, ${cyCenter})`);


    // Let's add tooltips - fun for the whole family

    //bisector function to find circle appearance index
    let bisectFunction = d3.bisector(function(d) { return csvData.indexOf(d); }).left;

    // create svg group called focus to draw tooltip box
    let focus = chartGroup.append("g")
            .attr("class", "focus")
            .style("display", "none");

    // define circle marker properties
    focus.append("circle")
        .attr("r", 5)
        .classed('circle-marker', true)


    // define tooltip text box properties
    focus.append("rect")
        .attr("class", "tooltip")
        .attr("width", 100)
        .attr("height", 50)
        .attr("x", 10)
        .attr("y", -22)
        .attr("rx", 4)
        .attr("ry", 4);

    // add svg text to tooltip box for country/region
    focus.append("text")
        .attr("class", "tooltip-country")
        .attr("x", 18)
        .attr("y", -2);

    // add svg text for Province/State
    focus.append("text")
        .attr("class", "tooltip-province")
        .attr("x", 18)
        .attr("y", 18);

    // add svg text to tooltip box for static cases text
    focus.append("text")
        .attr("x", 18)
        .attr("y", 38)
        .text("Cases: ");

    // text for dynamic cases text
    focus.append("text")
        .attr("class", "tooltip-cases")
        .attr("x", 60)
        .attr("y", 38);

    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", chartWidth)
        .attr("height", chartHeight)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    

    function mousemove() {
        let coords = d3.mouse(this);
        let adjusted_x = coords[0] - cxCenter - innerRadius, //adjust cartesian coordinates to reference circle center
            adjusted_y = -1 * (coords[1] - cyCenter - innerRadius);

        angle_in_radians = -(Math.atan2( adjusted_y, adjusted_x) - Math.PI/2); // math do convert cartesian coordinates to radian angle from center
        angle_in_radians = angle_in_radians > 0 ? angle_in_radians : (2*Math.PI) + angle_in_radians;
        let r0 = x.invert(angle_in_radians), //use the x d3 scalar with .invert to convert mouse x coordiate to country index
            i = bisectFunction(csvData, r0, 1),
            d0 = csvData[i - 1], // array left of cursor
            d1 = csvData[i], // array of values right of cursor
            d = r0 - d0 > d1 - r0 ? d1 : d0; //ternary operator to decide which datapoint to show
        
        // recalculate from radians to cartesian for where to place tooltip
        let markerTheta = x(csvData.indexOf(d)),
            markerRadius = y(d[`${casesDate}`]);
        
        let markerXTransform = (markerRadius * Math.cos(markerTheta - Math.PI/2)) + 0.5*cxCenter + innerRadius + 24;
        let markerYTransform = (markerRadius * Math.sin(markerTheta - Math.PI/2)) + 0.5*cyCenter + innerRadius - 6;
        
        console.log(markerXTransform, markerYTransform);
        focus.attr("transform", `translate(${markerXTransform}, ${markerYTransform})`);
        focus.select(".tooltip-country").text(d['Country/Region']);
        focus.select(".tooltip-province").text(d['Province/State']);
        focus.select(".tooltip-cases").text(d[casesDate]);
        
        
    }



    function animateDraw(line){
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
            .ease(d3.easeExp)
            .attr('stroke-dashoffset', 0);
    }

    animateDraw(0);


    // // create listener for mouseover to show tooltips
    // stateLabels.on('mouseover', function(d){
    //     toolTip.show(d, this);
    // })
    // .on('mouseout', function(d){
    //     toolTip.hide(d);

    // });

}
    ).catch(function(error) {
        console.log(error);
    });
    
// makeResponsive();
// d3.select(window).on("resize", makeResponsive);


