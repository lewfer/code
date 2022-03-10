/*
 * multiline.js
 * 
 * D3 code to draw a simple multiple line chart
 */

function drawLine(container, data, parameters={}) {
    // Select the default parameters or select from provided parameters
    const colours    = parameters['colours']    || d3.schemeCategory10
    const xCol       = parameters['xCol']       || data.columns[0]
    const seriesCols = parameters['seriesCols'] || data.columns.slice(1)
    const valueName  = parameters['valueName']

    // Create our D3 Simple object 
    let chart = new D3SI(container, data, parameters)

    // Process the data into series groupings
    let seriesData = chart.groupDataBySeries(xCol)
    let minGroupValue = chart.groupMin(seriesData)
    let maxGroupValue = chart.groupMax(seriesData)

    // Create our scales to map data to screen position and colours
    let xScale = chart.xScaleBand(xCol) 
    let yScale = chart.yScaleLinearMinMax(minGroupValue, maxGroupValue) 
    let colourScale = chart.colourScaleOrdinal(seriesCols, colours)   // scale to colour each series
    
    // Get an object representing all the lines in the chart
    let lines = chart.bind(".series", seriesData)

    // Generator for the svg points for the line
    let linepoints = chart.getLineGenerator("index", "value", xScale, yScale)

    // Add the lines to the chart, one line for each series
    lines
        // Handle 'entered' data items by creating a g containing a path for each one
        .enter()
        .append("g")
            .attr("class",          "series")
        .append('path')
            .attr("class",          "line")
            .attr("d",              function(d) { return linepoints(d.values) })
            .attr("transform",      "translate(" + xScale.bandwidth()/2 + ",0)")    
            .style("stroke",        chart.colourMap("series",colourScale)) 
        
        
    // Add axes
    chart.drawAxisXBottom(xScale, xCol)
    chart.drawAxisYLeft(yScale, valueName)    
}
