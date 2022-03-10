/*
 * circles.js
 * D3 code to draw a simple circles chart.
 * Adding circles spread along the x-axis
 */

function drawCircles(container, data, parameters={}) {
    const colours = parameters['colours'] || d3.schemeCategory10  
    
    // Create our chart object
    var chart = new D3SI(container, data, parameters)

    // Create our scales to map data values to screen position 
    var xScale = chart.xScaleBand("State")
    var yScale = chart.yScaleLinear("Clashes")
    var rScale = chart.scaleCircleRadius("Conflict", 2, 20)
    var colourScale = chart.colourScaleOrdinal("State", colours)   

    // Get a selection object representing all the circles we want in the chart, one for each item in the data
    var circleSelection = chart.bind("circle") 

    // Add the circles svg elements to the chart, one for each item in the selection
    circleSelection = chart.append(circleSelection, "circle")
        .attr("cx", function (d) { return xScale(d["State"]) })
        .attr("cy", function (d) { return yScale(d["Clashes"]) })
        .attr("r",  function (d) { return rScale(d["Conflict"]) })
        .style("fill", function (d) { return colourScale(d["State"]) })
        .style("opacity",   0.7) 

    circleSelection = chart.addStandardTooltip(circleSelection, getTooltipData)

    // Add axes
    chart.drawAxisXBottom("State")
    chart.drawAxisYLeft("Clashes")    
}


        