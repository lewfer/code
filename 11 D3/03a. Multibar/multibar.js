/*
 * multibar.js
 * 
 * D3 code to draw a simple grouped bar chart
 * 
 */

function drawMultiBar(container, data, parameters={}) {
    // Select the default parameters or select from provided parameters
    const colours    = parameters['colours']    || d3.schemeCategory10
    const xCol       = parameters['xCol']       || data.columns[0]
    const seriesCols = parameters['seriesCols'] || data.columns.slice(1)
    const valueName  = parameters['valueName']

    // Create our D3 Simple object 
    let chart = new D3SI(container, data, parameters)
    console.log(data)

    // Process the data into series groupings
    let indexData = chart.groupDataByIndex(xCol)
    let minGroupValue = chart.groupMin(indexData)
    let maxGroupValue = chart.groupMax(indexData)

    console.log(indexData)
    // Create our scales to map data to screen position and colours
    let xIndexScale = chart.xScaleBand(xCol) 
    let yScale = chart.yScaleLinearMinMax(0, maxGroupValue) 
    let xSeriesScale = chart.xSeriesScaleBand(seriesCols, xIndexScale)  // scale to position each series
    let colourScale = chart.colourScaleOrdinal(seriesCols, colours)     // scale to colour each series
    let miny = 0

    // Get an object representing all the groups of bars
    let groupSelection = chart.bind('g', indexData)

    // Add the group elements, one group for each index
    let groupEls = 
        groupSelection
            // Handle 'entered' items, i.e. indexes, by creating a group for each one
            .enter()
            .append("g")
                .attr("transform", function(d) { return "translate(" + xIndexScale(d.index) + ",0)" } )
    
    // Get an object representing all the bars in the chart
    let bars = 
        groupEls
            .selectAll("rect")
            .data(valueMap("values"))

    // Add the bar elements to the chart, one bar for each series
    bars
        // Handle 'entered' items, i.e. series values within each index, by creating a rect for each one within each g
        .enter()
        .append("rect")
            .attr("x",        function(d) { return xSeriesScale(d["series"]) })
            .attr("y",        function(d) { return yScale(d["value"]) })
            .attr("width",    xSeriesScale.bandwidth())
            .attr("height",   function(d) { return yScale(miny)-yScale(d["value"]) })
            .style("fill",    chart.colourMap("series",colourScale))
            .style("opacity", 0.7)        
        
    // Add axes
    chart.drawAxisXBottom(xIndexScale, xCol)
    chart.drawAxisYLeft(yScale, valueName)     
}
