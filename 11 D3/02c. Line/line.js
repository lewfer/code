/*
 * line.js
 *  
 * D3 code to draw a simple line chart
 */

function drawLine(container, data, parameters={}) {
    // Select the default parameters or select from provided parameters
    const xCol = parameters['xCol'] || data.columns[0]
    const yCol = parameters['yCol'] 
    const colour = parameters['colour'] || "#f02035"

    // Create our D3 Simple object
    let chart = new D3SI(container, data, parameters)

    // Create our scales to map data to screen position
    let xScale = chart.xScaleBand(xCol) 
    let yScale = chart.yScaleLinear(yCol) 

    // Define the line
    let linepoints = chart.getLineGenerator(xCol, yCol, xScale, yScale)

    // Get an object representing the one line
    let lineSelection = chart.bindDatum("path")

    // Add the line to the chart
    lineSelection
        .attr("class",      "line")
        .attr("d",          linepoints)
        .attr("transform",  "translate(" + xScale.bandwidth()/2 + ",0)")      // move to right to align data points with axis
        .style("stroke",    colour)    

    // Add axes
    chart.drawAxisXBottom(xScale, xCol)
    chart.drawAxisYLeft(yScale, yCol) 
}
