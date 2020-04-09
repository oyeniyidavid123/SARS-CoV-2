// svg dimensions
let svgHeight = 600,
    svgWidth = 900;

// make responsive function
function makeResponsive() {

  var svgArea = d3.select("#dataGraph").select("svg");
  if (!svgArea.empty()) {
    svgArea.remove();
  }}

// set chart margins
let chartMargins = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
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

let csvPathConfirmed = '/data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv',
    csvPathDeaths = '/data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv',
    csvPathRecovered = '/data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv'

let casesDate = '1/22/20'

//promise that reads multiple csvs
Promise.all([
    d3.csv(csvPathConfirmed),
    d3.csv(csvPathDeaths),
    d3.csv(csvPathRecovered)
])
.then(csvData => {

    //append html objects

    let radialLine = chartGroup.append('path')
    let dateDisplay = chartGroup.append('text')
    let focus = chartGroup.append("g")
    // create svg group called focus to draw tooltip box
    focus.attr("class", "focus")
            .style("display", "none");

    // define circle marker properties
    focus.append("circle")
        .attr("r", 5)
        .classed('circle-marker', true)

    // define tooltip text box properties
    focus.append("rect")
        .attr("class", "tooltip")
        .attr('fill', 'white')
        .attr('stroke', '#000')
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
    let toolTipDataSet = focus.append("text")
        .attr("x", 18)
        .attr("y", 38);

    // text for dynamic cases text
    focus.append("text")
        .attr("class", "tooltip-cases")
        .attr("x", 18)
        .attr("y", 58);
    // create box that monitors mouse input
    let toolTipHandler = svg.append("rect")
        .attr('id', 'toolTipHandler')
        .attr('height', '800')
        .attr("class", "overlay")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
        

    // create dropdown based on date
    let dateDropdown = d3.select('#dataGraphDiv')
        .insert("div",":first-child").classed('dropdown', true)
            // .attr('position', 'absolute')
            // .attr('top', '80px')
            // .classed('col-md-2', true);
        .append('button').classed('btn btn-dark dropdown-toggle', true)
            .attr('id', 'dropdownDateDisplay')
            .attr('type', 'button')
            .attr('data-toggle', 'dropdown')
            .attr('aria-haspopup', 'true')
            .attr('aria-expanded', 'false')
            .append('div').classed('dropdown-menu scrollable', true).attr('aria-labelledby', 'dropdownMenuButton')

    // choose dataset based on selection of confirmed cases (0), deaths (1), recovered (2)
    
    function initializeData(dataSet){
        // create array of all dates
        dateArray = csvData[dataSet].columns.slice(4);
        
        // casesDate = csvData[dataSet].columns[4];
        // nested forEach to convert case values to int
        csvData[dataSet].forEach(function(country) {
            csvData[dataSet].columns.slice(4).forEach(date => {
                country[`${date}`] = +country[`${date}`];
                
            });
        });
        // create array of countries
        countryArray = [];
        csvData[dataSet].forEach(row =>{
            //if country matches then create array of # of cases 
            countryArray.push(row['Country/Region'])
        });

        csvData[dataSet].push(csvData[dataSet][0]); // add the first entry to the end to make a complete circle

        // Set circle inner and outer radii
        let innerRadius = 100,
            outerRadius = d3.min([chartWidth, chartHeight])/1.8; // outer radius is scaled to the size of the height or 
            //width of the svg, whichever is smaller

        //set circle centers
        let cxCenter = `${chartWidth/2 - 150}`,
        cyCenter = `${chartWidth/2 - 210}`;

        // set other circle values
        circleRadians = 2 * Math.PI;

        // set x scales for dates to angles in radians
        let x = d3.scaleLinear()
            .domain([0, csvData[dataSet].length])
            .range([0, circleRadians]);
        
        // set y scales according to the highest number of cases to radius
        let y = d3.scaleRadial()
            .domain([0, d3.max(csvData[dataSet], data => data['3/27/20'])])
            .range([innerRadius, outerRadius]);

        //configure line function for drawing line
        let drawLine = d3.lineRadial()
            .angle(function(d) {return x(csvData[dataSet].indexOf(d))})
            .radius(function(d) {return y(d[`${casesDate}`])});

        // add line as svg path using line function
        radialLine.datum(csvData[dataSet])
            .attr('fill', 'none')

            .attr('stroke-width', '3')
            .attr('d', drawLine)
            .attr('id', 'dataLine')
            .attr('transform', `translate(${cxCenter}, ${cyCenter})`);
        
        // switch function to determine line stroke color
        switch(dataSet) {
            case 0:
                radialLine.attr('stroke', '#d29d00')
                break;
            case 1:
                radialLine.attr('stroke', '#bc2130')
                break;
            case 2:
                radialLine.attr('stroke', '#1e7d33')
                break;
        }

        // add center text to display date
        dateDisplay.text(`${casesDate}`)
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'central')
            .attr('font-size', '30')
            .attr('font-weight', 'bold')
            .attr('font-family', 'Verdana')
            .attr('transform', `translate(${cxCenter}, ${cyCenter})`)


        // Let's add tooltip creating function - fun for the whole family
        //bisector function to find circle appearance index
        let bisectFunction = d3.bisector(function(d) { return csvData[dataSet].indexOf(d); }).left;

        // handler function for moving tooltip with mouse    
        function mousemove() {
            let coords = d3.mouse(this);
            let adjusted_x = coords[0] - cxCenter - innerRadius, //adjust cartesian coordinates to reference circle center
                adjusted_y = -1 * (coords[1] - cyCenter - innerRadius);

            angle_in_radians = -(Math.atan2( adjusted_y, adjusted_x) - Math.PI/2); // math do convert cartesian coordinates to radian angle from center
            angle_in_radians = angle_in_radians > 0 ? angle_in_radians : (2*Math.PI) + angle_in_radians;
            let r0 = x.invert(angle_in_radians), //use the x d3 scalar with .invert to convert mouse x coordiate to country index
                i = bisectFunction(csvData[dataSet], r0, 1),
                d0 = csvData[dataSet][i - 1], // array left of cursor
                d1 = csvData[dataSet][i], // array of values right of cursor
                d = r0 - d0 > d1 - r0 ? d1 : d0; //ternary operator to decide which data point to show
            
            // recalculate from radians to cartesian for where to place tooltip
            let markerTheta = x(csvData[dataSet].indexOf(d)),
                markerRadius = y(d[`${casesDate}`]);
            let markerXTransform = (markerRadius * Math.cos(markerTheta - Math.PI/2)) + 0.5*cxCenter + innerRadius + 24;
            let markerYTransform = (markerRadius * Math.sin(markerTheta - Math.PI/2)) + 0.5*cyCenter + innerRadius - 6;
            
            //adjust the tooltip according to the mouse pointer position
            console.log(markerXTransform, markerYTransform);
            focus.attr("transform", `translate(${markerXTransform}, ${markerYTransform})`);
            focus.select(".tooltip-country").text(d['Country/Region']);
            focus.select(".tooltip-province").text(d['Province/State']);
            focus.select(".tooltip-cases").text(d[casesDate]);   
        }
        
        //initialize tooltip settings
        toolTipHandler.on("mousemove", mousemove)
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); });;
        
        // switch statement for tooltip based on data set selection
        switch(dataSet) {
            case 0:
                toolTipDataSet.text('Cases:')
                break;
            case 1:
                toolTipDataSet.text('Deaths:')
                break;
            case 2:
                toolTipDataSet.text('Recovered:')
                break;
        }

    
        //loop to add all the dates to dropdown
        dateDropdown.selectAll('a').remove();
        dateArray.forEach(date => {
            let dateSelection = dateDropdown.append('a')
                .classed('dropdown-item', true)
                .attr('id', `casesDate${date}`)
                .attr('value', `${date}`)
                .attr('href', '#')
                .text(date);

            //listener to update based on date selection
            dateSelection.on('click', function(){
                let transitionDuration = 1000;
                console.log(date)
                casesDate = date; //update casesDate
                //update the date displayed in the center
                dateDisplay.transition()
                    .duration(transitionDuration/4)
                    .attr('opacity', 0)
                    .transition()
                    .text(`${date}`) 
                    .transition()
                    .duration(transitionDuration/4)
                    .attr('opacity', 1)
                    
                // d3.select('#dropdownDateDisplay').text(`${date}`) //update the date displayed on the dropdown
            
                //reconfigure line drawing function
                let drawLine = d3.lineRadial()
                    .angle(function(d) {return x(csvData[dataSet].indexOf(d))})
                    .radius(function(d) {return y(d[`${casesDate}`])});
                //redraw line
                radialLine
                    .transition()
                    .duration(transitionDuration)
                    .ease(d3.easeExp)
                    .attr('d', drawLine);
                // update tooltips
                d3.select('#toolTipHandler')
                .on("mousemove", mousemove);
            });
        });
        }

    initializeData(1); //initial settings for graph on page load
    


    function animateDraw(){
        let lineLength = radialLine.node().getTotalLength();
        radialLine
            .attr('stroke-dasharray', lineLength + " " + lineLength) //set line to double length, with half being an empty dash
            .transition().duration(800).ease(d3.easeExp)
            .attr('stroke-dashoffset', lineLength) // set initial empty dash to be the visible part
            .transition().duration(800).ease(d3.easeExp)
            .attr('stroke-dashoffset', 0)
            .transition()
            .attr('stroke-dasharray', 'none');
    }
    animateDraw(); //draw the circle upon page load



    d3.select('#cases-CSV-Button').on('click', function(){
        animateDraw();
        setTimeout(function(){initializeData(0)}, 1000)
    });

    d3.select('#deaths-CSV-Button').on('click', function(){
        animateDraw();
        setTimeout(function(){initializeData(1)}, 1000)
    });

    d3.select('#recovered-CSV-Button').on('click', function(){
        animateDraw();
        setTimeout(function(){initializeData(2)}, 1000)
    });

    
} // promise end
    ).catch(function(error) {
        console.log(error);
    });
    

